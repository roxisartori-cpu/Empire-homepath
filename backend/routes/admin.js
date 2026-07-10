import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

function requireAdminKey(req, res, next) {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_SECRET_KEY;
  if (!expected || key !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

async function listAll(listFn, params = {}) {
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

router.get('/api/admin/stats', requireAdminKey, async (req, res) => {
  try {
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes('placeholder') ||
      process.env.STRIPE_SECRET_KEY.includes('your_stripe')
    ) {
      return res.status(503).json({
        error: 'Stripe is not configured. Set STRIPE_SECRET_KEY on the backend.',
      });
    }

    const now = new Date();
    const monthStartUnix = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
    const sixMonthsAgoUnix = Math.floor(new Date(now.getFullYear(), now.getMonth() - 5, 1).getTime() / 1000);

    const [subscriptions, allCharges] = await Promise.all([
      listAll((params) =>
        stripe.subscriptions.list({
          ...params,
          status: 'all',
          expand: ['data.customer', 'data.items.data.price.product'],
        }),
      ),
      listAll((params) => stripe.charges.list({ ...params })),
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
    res.status(500).json({ error: 'Failed to fetch Stripe stats', details: err.message });
  }
});

export default router;
