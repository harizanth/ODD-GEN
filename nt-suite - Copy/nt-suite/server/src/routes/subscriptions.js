import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// List plans and active subscriptions
router.get('/', async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        partner: true,
        plan: true,
      },
      orderBy: { id: 'desc' },
    });
    const plans = await prisma.subscriptionPlan.findMany({
      include: { product: true },
    });

    const mrrTotal = subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.mrr, 0);

    res.json({ subscriptions, plans, mrrTotal });
  } catch (err) { next(err); }
});

// Create subscription
router.post('/', async (req, res, next) => {
  try {
    const { partnerId, planId, startDate } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: Number(planId) } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const count = await prisma.subscription.count();
    const code = `SUB-${String(count + 1).padStart(4, '0')}`;

    const nextBill = new Date(startDate || Date.now());
    nextBill.setMonth(nextBill.getMonth() + (plan.billingPeriod === 'yearly' ? 12 : 1));

    const sub = await prisma.subscription.create({
      data: {
        code,
        partnerId: Number(partnerId),
        planId: Number(planId),
        mrr: plan.billingPeriod === 'yearly' ? Math.round(plan.price / 12) : plan.price,
        status: 'active',
        startDate: startDate ? new Date(startDate) : new Date(),
        nextBill,
      },
      include: { partner: true, plan: true },
    });
    res.status(201).json(sub);
  } catch (err) { next(err); }
});

// Update status (active, paused, cancelled)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const sub = await prisma.subscription.update({
      where: { id },
      data: { status },
      include: { partner: true, plan: true },
    });
    res.json(sub);
  } catch (err) { next(err); }
});

export default router;
