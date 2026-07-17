import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { authenticateToken } from './middleware.js';

const client = createClient({
  url: process.env.TURSO_URL || process.env.TEAM_DB_URL || 'libsql://agent-team-5cbc01a6-cto.aws-us-west-2.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || process.env.TEAM_DB_AUTH_TOKEN,
});

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'empire-homepath-pro-secret-key-2026';

// --- Stripe mode switch ---
// Set STRIPE_MODE to "test" or "live" on Render. This picks which secret key
// gets used, so the test and live keys can both live in the environment at
// the same time without ever overwriting each other.
const STRIPE_MODE = (process.env.STRIPE_MODE || 'test').toLowerCase();

const stripeSecretKey =
  STRIPE_MODE === 'live'
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY_TEST;

if (!stripeSecretKey) {
  console.error(
    `CRITICAL: STRIPE_MODE is set to "${STRIPE_MODE}" but the matching key ` +
    `(STRIPE_SECRET_KEY_${STRIPE_MODE.toUpperCase()}) is not set in the environment.`
  );
}

const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder');

console.log(
  `[Stripe] Running in ${STRIPE_MODE.toUpperCase()} mode. ` +
  `Key in use starts with: ${(stripeSecretKey || 'MISSING').slice(0, 12)}...`
);

async function runDb(query, params = []) {
  try {
    const result = await client.execute({ sql: query, args: params });
    return result.rows;
  } catch (err) {
    console.error('DB Error:', err.message);
    throw err;
  }
}

function planFromPriceId(priceId) {
  if (!priceId) return 'individual';
  if (
    priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID_LIVE ||
    priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID_TEST
  ) return 'professional';
  if (
    priceId === process.env.STRIPE_INDIVIDUAL_PRICE_ID_LIVE ||
    priceId === process.env.STRIPE_INDIVIDUAL_PRICE_ID_TEST
  ) return 'individual';
  return 'individual';
}

async function findUserByEmail(email) {
  if (!email) return null;
  const rows = await runDb('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
  return rows[0] || null;
}

async function findUserByStripeCustomerId(customerId) {
  if (!customerId) return null;
  const rows = await runDb('SELECT * FROM users WHERE stripe_customer_id = ?', [customerId]);
  return rows[0] || null;
}

// Stripe webhook — must use raw body before express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret =
    STRIPE_MODE === 'test'
      ? process.env.STRIPE_TEST_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];

  if (!webhookSecret || webhookSecret.includes('your_stripe_webhook')) {
    const secretName =
      STRIPE_MODE === 'test' ? 'STRIPE_TEST_WEBHOOK_SECRET' : 'STRIPE_WEBHOOK_SECRET';
    console.error(`${secretName} is not configured`);
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          null;
        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id || null;

        console.log('[webhook] checkout.session.completed received', {
          sessionId: session.id,
          emailFromStripe: email,
          customerId,
          customerDetailsEmail: session.customer_details?.email || null,
          customerEmail: session.customer_email || null,
          paymentStatus: session.payment_status,
          mode: session.mode,
        });

        let priceId = null;
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
          priceId = lineItems.data[0]?.price?.id || null;
          console.log('[webhook] line items priceId:', priceId);
        } catch (lineErr) {
          console.error('Failed to list checkout line items:', lineErr.message);
        }

        const plan = planFromPriceId(priceId);
        const userByEmail = await findUserByEmail(email);
        const userByCustomerId = userByEmail ? null : await findUserByStripeCustomerId(customerId);
        const user = userByEmail || userByCustomerId;

        console.log('[webhook] user lookup result', {
          emailFromStripe: email,
          foundByEmail: !!userByEmail,
          foundByCustomerId: !!userByCustomerId,
          matchedUserEmail: user?.email || null,
          matchedUserId: user?.id || null,
          currentStatus: user?.subscription_status || null,
          planToSet: plan,
        });

        if (!user) {
          console.warn(`checkout.session.completed: no user for email=${email} customer=${customerId}`);
          break;
        }

        await runDb(
          'UPDATE users SET subscription_status = ?, plan = ?, stripe_customer_id = COALESCE(NULLIF(stripe_customer_id, \'\'), ?) WHERE id = ?',
          ['active', plan, customerId || '', user.id],
        );
        console.log(`Activated subscription for ${user.email} (plan=${plan})`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer?.id || null;

        let user = await findUserByStripeCustomerId(customerId);
        if (!user && customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId);
            if (!customer.deleted) user = await findUserByEmail(customer.email);
          } catch (custErr) {
            console.error('Failed to retrieve customer for cancelled subscription:', custErr.message);
          }
        }

        if (!user) {
          console.warn(`customer.subscription.deleted: no user for customer=${customerId}`);
          break;
        }

        await runDb('UPDATE users SET subscription_status = ? WHERE id = ?', ['cancelled', user.id]);
        console.log(`Cancelled subscription for ${user.email}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id || null;
        const email = invoice.customer_email || null;

        let user = (await findUserByStripeCustomerId(customerId)) || (await findUserByEmail(email));
        if (!user && customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId);
            if (!customer.deleted) user = await findUserByEmail(customer.email);
          } catch (custErr) {
            console.error('Failed to retrieve customer for failed invoice:', custErr.message);
          }
        }

        if (!user) {
          console.warn(`invoice.payment_failed: no user for email=${email} customer=${customerId}`);
          break;
        }

        await runDb('UPDATE users SET subscription_status = ? WHERE id = ?', ['past_due', user.id]);
        console.log(`Marked past_due for ${user.email}`);
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed', details: err.message });
  }
});

app.use(express.json());

async function listAllStripe(listFn, params = {}) {
  const items = [];
  let starting_after;
  for (;;) {
    const page = await listFn({
      limit: 100,
      ...params,
      ...(starting_after ? { starting_after } : {}),
    });
    items.push(...page.data);
    if (!page.has_more || page.data.length === 0) break;
    starting_after = page.data[page.data.length - 1].id;
  }
  return items;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function planNameFromSubscription(sub) {
  const item = sub.items?.data?.[0];
  const product = item?.price?.product;
  if (product && typeof product === 'object' && product.name) return product.name;
  if (item?.price?.nickname) return item.price.nickname;
  const amount = item?.price?.unit_amount || 0;
  if (amount === 15000) return 'Individual';
  if (amount === 37500) return 'Professional';
  if (amount > 37500) return 'Enterprise';
  return 'Subscription';
}

function monthlyAmountCents(sub) {
  let total = 0;
  for (const item of sub.items?.data || []) {
    const price = item.price;
    if (!price || price.unit_amount == null) continue;
    let amount = price.unit_amount * (item.quantity || 1);
    const interval = price.recurring?.interval;
    const count = price.recurring?.interval_count || 1;
    if (interval === 'year') amount = amount / (12 * count);
    else if (interval === 'week') amount = (amount * 52) / (12 * count);
    else if (interval === 'day') amount = (amount * 365) / (12 * count);
    else amount = amount / count;
    total += amount;
  }
  return total;
}

// Admin Stripe stats — mounted directly on the main server so Render always picks it up
app.get('/api/admin/stats', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (
      !stripeSecretKey ||
      stripeSecretKey.includes('placeholder') ||
      stripeSecretKey.includes('your_stripe')
    ) {
      return res.status(503).json({
        error: `Stripe is not configured for ${STRIPE_MODE.toUpperCase()} mode. Set STRIPE_SECRET_KEY_${STRIPE_MODE.toUpperCase()} on the backend.`,
      });
    }

    const now = new Date();
    const monthStartUnix = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
    const sixMonthsAgoUnix = Math.floor(new Date(now.getFullYear(), now.getMonth() - 5, 1).getTime() / 1000);

    const [subscriptions, allCharges] = await Promise.all([
      listAllStripe((params) =>
        stripe.subscriptions.list({
          ...params,
          status: 'all',
          expand: ['data.customer', 'data.items.data.price'],
        }),
      ),
      listAllStripe((params) => stripe.charges.list({ ...params })),
    ]);

    const succeededCharges = allCharges
      .filter((c) => c.status === 'succeeded')
      .sort((a, b) => b.created - a.created);

    const activeSubs = subscriptions.filter((s) => s.status === 'active' || s.status === 'trialing');

    let mrrCents = 0;
    const planCounts = { Individual: 0, Professional: 0, Enterprise: 0, Other: 0 };
    for (const sub of activeSubs) {
      mrrCents += monthlyAmountCents(sub);
      const name = planNameFromSubscription(sub);
      const lower = name.toLowerCase();
      if (lower.includes('individual')) planCounts.Individual += 1;
      else if (lower.includes('professional')) planCounts.Professional += 1;
      else if (lower.includes('enterprise')) planCounts.Enterprise += 1;
      else planCounts.Other += 1;
    }

    const newThisMonth = subscriptions.filter((s) => s.created >= monthStartUnix).length;
    const cancelledThisMonth = subscriptions.filter(
      (s) => s.canceled_at && s.canceled_at >= monthStartUnix,
    ).length;

    const customerLastPayment = new Map();
    for (const charge of succeededCharges) {
      if (!charge.customer) continue;
      const customerId = typeof charge.customer === 'string' ? charge.customer : charge.customer.id;
      const prev = customerLastPayment.get(customerId);
      if (!prev || charge.created > prev) customerLastPayment.set(customerId, charge.created);
    }

    const subscribers = subscriptions
      .filter((s) => ['active', 'trialing', 'past_due', 'canceled', 'unpaid'].includes(s.status))
      .map((sub) => {
        const customer = typeof sub.customer === 'object' && sub.customer ? sub.customer : null;
        const customerId = customer?.id || (typeof sub.customer === 'string' ? sub.customer : null);
        const lastPaymentUnix = customerId ? customerLastPayment.get(customerId) : null;
        let statusLabel = 'Active';
        if (sub.status === 'canceled') statusLabel = 'Cancelled';
        else if (sub.status === 'past_due' || sub.status === 'unpaid') statusLabel = 'Past Due';

        return {
          id: sub.id,
          name: customer?.name || customer?.email?.split('@')[0] || 'Subscriber',
          email: customer?.email || '—',
          plan: planNameFromSubscription(sub),
          status: statusLabel,
          created: new Date(sub.created * 1000).toISOString(),
          lastPayment: lastPaymentUnix ? new Date(lastPaymentUnix * 1000).toISOString() : null,
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    const payments = succeededCharges.slice(0, 10).map((charge) => {
      const email =
        charge.billing_details?.email ||
        charge.receipt_email ||
        (typeof charge.customer === 'object' ? charge.customer?.email : null) ||
        '—';
      return {
        date: new Date(charge.created * 1000).toISOString(),
        email,
        amount: charge.amount / 100,
        status: charge.status === 'succeeded' ? 'Paid' : charge.status,
        invoice: charge.receipt_url || null,
      };
    });

    const monthBuckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthBuckets.push({
        key: monthKey(d),
        label: d.toLocaleString('en-US', { month: 'short' }),
        revenue: 0,
      });
    }
    const bucketMap = Object.fromEntries(monthBuckets.map((b) => [b.key, b]));

    let totalRevenueCents = 0;
    for (const charge of succeededCharges) {
      totalRevenueCents += charge.amount;
      if (charge.created >= sixMonthsAgoUnix) {
        const key = monthKey(new Date(charge.created * 1000));
        if (bucketMap[key]) bucketMap[key].revenue += charge.amount / 100;
      }
    }

    const mrr = Math.round(mrrCents) / 100;

    res.json({
      totalSubscribers: activeSubs.length,
      mrr,
      newThisMonth,
      cancelledThisMonth,
      planCounts,
      totalRevenue: totalRevenueCents / 100,
      arr: mrr * 12,
      monthlyRevenue: monthBuckets.map((b) => ({
        month: b.label,
        revenue: Math.round(b.revenue * 100) / 100,
      })),
      subscribers,
      payments,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Endpoints ---

app.post('/api/register', async (req, res) => {
  const email = (req.body.email || '').trim();
  const password = (req.body.password || '').trim();
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await runDb('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already registered' });

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const role = email === 'RoxanneSartori@gmail.com' ? 'admin' : 'user';

    // Create Stripe customer
    let stripeCustomerId = null;
    try {
      console.log(`Creating Stripe customer for ${email}...`);
      // Check if customer already exists in Stripe by email to avoid duplicates
      const existingCustomers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
      
      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
        console.log(`Found existing Stripe customer for ${email}: ${stripeCustomerId}`);
      } else {
        const customer = await stripe.customers.create({ 
          email: email.toLowerCase(),
          metadata: { userId: id, source: 'registration' }
        });
        stripeCustomerId = customer.id;
        console.log(`Stripe customer created: ${stripeCustomerId}`);
      }
    } catch (sErr) {
      console.error('CRITICAL: Stripe customer operations failed during registration:', sErr.message);
      // We don't block registration, the lazy logic in checkout will try again if needed.
    }

    await runDb('INSERT INTO users (id, email, password_hash, stripe_customer_id, created_at, role) VALUES (?, ?, ?, ?, ?, ?)', [id, email, passwordHash, stripeCustomerId || '', createdAt, role]);

    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id, email, plan: 'free', role } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const email = (req.body.email || '').trim();
  const password = (req.body.password || '').trim();
  console.log('Login attempt for:', email);
  console.log('Password length:', password ? password.length : 0);
  try {
    const users = await runDb('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    console.log('Users found:', users.length);
    if (users.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        plan: user.plan,
        role: user.role,
        subscription_status: user.subscription_status
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const users = await runDb('SELECT id, email, plan, subscription_status, white_label_settings, role FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// --- Admin Endpoints ---

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  try {
    const users = await runDb('SELECT id, email, plan, subscription_status, trial_end, created_at, role FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

app.post('/api/admin/update-user', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const { userId, plan, subscription_status, trial_end, role, white_label_settings } = req.body;
  
  try {
    let updates = [];
    let params = [];
    if (plan) { updates.push('plan = ?'); params.push(plan); }
    if (subscription_status) { updates.push('subscription_status = ?'); params.push(subscription_status); }
    if (trial_end) { updates.push('trial_end = ?'); params.push(trial_end); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (white_label_settings) { updates.push('white_label_settings = ?'); params.push(JSON.stringify(white_label_settings)); }

    if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });

    params.push(userId);
    await runDb(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

app.post('/api/user/settings', authenticateToken, async (req, res) => {
  const { white_label_settings } = req.body;
  // Only allow white-label plan or admin to update these
  try {
    const users = await runDb('SELECT plan, role FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];
    if (user.plan !== 'white-label' && user.role !== 'admin') {
      return res.status(403).json({ error: 'White Label plan required' });
    }

    await runDb('UPDATE users SET white_label_settings = ? WHERE id = ?', [JSON.stringify(white_label_settings), req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings', details: err.message });
  }
});

// --- Subscription Endpoints ---

app.post('/api/create-checkout-session', authenticateToken, async (req, res) => {
  const { plan } = req.body; // 'individual' or 'professional'

  const priceIdsByMode = {
    test: {
      individual: process.env.STRIPE_INDIVIDUAL_PRICE_ID_TEST,
      professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID_TEST,
    },
    live: {
      individual: process.env.STRIPE_INDIVIDUAL_PRICE_ID_LIVE,
      professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID_LIVE,
    },
  };

  const priceId = priceIdsByMode[STRIPE_MODE]?.[plan];

  if (!priceId) {
    return res.status(400).json({
      error: `No price ID configured for plan "${plan}" in ${STRIPE_MODE.toUpperCase()} mode. Check STRIPE_${(plan || '').toUpperCase()}_PRICE_ID_${STRIPE_MODE.toUpperCase()} on the backend.`,
    });
  }

  try {
    const users = await runDb('SELECT email, stripe_customer_id FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    
    let customerId = users[0].stripe_customer_id;
    const email = users[0].email;

    if (!customerId || customerId.trim() === '') {
      console.log(`User ${req.user.id} missing Stripe customer ID. Attempting lazy creation for ${email}...`);
      try {
        // First, check if customer already exists in Stripe by email to avoid duplicates
        const existingCustomers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
        
        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
          console.log(`Found existing Stripe customer for ${email}: ${customerId}`);
        } else {
          const customer = await stripe.customers.create({ 
            email: email.toLowerCase(),
            metadata: { userId: req.user.id, source: 'lazy_creation' }
          });
          customerId = customer.id;
          console.log(`Created new Stripe customer for ${email}: ${customerId}`);
        }

        // Update user in DB
        await runDb('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [customerId, req.user.id]);
      } catch (sErr) {
        console.error('CRITICAL: Lazy Stripe customer creation failed:', sErr.message);
        return res.status(500).json({ error: 'Failed to initialize payment profile', details: sErr.message });
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://empirehomepath.com/thankyou',
      cancel_url: `${req.headers.origin}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Stripe session creation failed', details: err.message });
  }
});

// --- Existing Functionality (Protected) ---

app.post('/api/verify', authenticateToken, async (req, res) => {
  // Check subscription before allowing verification
  try {
    const users = await runDb('SELECT subscription_status, plan, role FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];
    
    const isSubscribed = user?.subscription_status === 'active';
    const isAdmin = user?.role === 'admin';

    if (!isSubscribed && !isAdmin) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    const { program_id, user_data } = req.body;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    await runDb('INSERT INTO verification_requests (id, program_id, user_data, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [id, program_id, JSON.stringify(user_data), 'pending', created_at, created_at]);
    
    const messageId = crypto.randomUUID();
    await runDb('INSERT INTO inbox (id, from_agent, to_agent, body) VALUES (?, ?, ?, ?)', [messageId, 'agent-engineer', 'agent-live-verification-agent', `New verification request: ${id} for program ${program_id}`]);
    
    res.json({ id, status: 'pending' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/api/status/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const results = await runDb('SELECT * FROM verification_requests WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    const row = results[0];
    if (row.result_data) row.result_data = JSON.parse(row.result_data);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.post('/api/lender-inquiry', async (req, res) => {
    // This might remain public if it's the end-customer (homebuyer) filling it out
    // But in the SaaS model, maybe this is only for users on the LO/Agent's white-label portal
    // For now, keep as is.
  const { program_name, name, email, phone, message } = req.body;
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  try {
    await runDb('INSERT INTO lender_inquiries (id, program_name, name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, program_name, name, email, phone, message, created_at]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// --- Leads Endpoints ---

app.post('/api/leads', async (req, res) => {
  const { pro_id, email, county, income, purchase_price, matched_count } = req.body;
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  try {
    await runDb('INSERT INTO leads (id, pro_id, email, county, income, purchase_price, matched_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, pro_id, email, county, income, purchase_price, matched_count, created_at]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await runDb('SELECT * FROM leads WHERE pro_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads', details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge server listening on http://0.0.0.0:${PORT}`);
});

