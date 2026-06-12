import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { authenticateToken } from './middleware.js';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_URL || process.env.TEAM_DB_URL || 'libsql://agent-team-5cbc01a6-cto.aws-us-west-2.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || process.env.TEAM_DB_AUTH_TOKEN,
});

const app = express();
app.use(cors());

// Stripe webhook needs raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Webhook handling will go here
  res.send();
});

app.use(express.json());

const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'empire-homepath-pro-secret-key-2026';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

async function runDb(query, params = []) {
  try {
    const result = await client.execute({ sql: query, args: params });
    return result.rows;
  } catch (err) {
    console.error('DB Error:', err.message);
    throw err;
  }
}

// --- Auth Endpoints ---

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
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
      const customer = await stripe.customers.create({ email });
      stripeCustomerId = customer.id;
    } catch (sErr) {
      console.warn('Stripe customer creation failed (placeholder key?):', sErr.message);
    }

    await runDb('INSERT INTO users (id, email, password_hash, stripe_customer_id, created_at, role) VALUES (?, ?, ?, ?, ?, ?)', [id, email, passwordHash, stripeCustomerId || '', createdAt, role]);

    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id, email, plan: 'free', role } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/login', async (req, res) => { console.log('Login attempt:', req.body.email); console.log('Querying DB...');
  const { email, password } = req.body;
  try {
    const users = await runDb('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

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
  const { priceId } = req.body; // Price IDs for Standard ($150) or White Label ($375)
  
  try {
    const users = await runDb('SELECT stripe_customer_id FROM users WHERE id = ?', [req.user.id]);
    const customerId = users[0]?.stripe_customer_id;

    if (!customerId) return res.status(400).json({ error: 'Stripe customer not found for user' });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
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
    
    const isSubscribed = user?.subscription_status === 'active' || user?.subscription_status === 'trialing';
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

