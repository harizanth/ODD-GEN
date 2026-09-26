import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get active session or all sessions
router.get('/sessions', async (req, res, next) => {
  try {
    const sessions = await prisma.posSession.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        orders: { include: { lines: { include: { product: true } } } },
      },
      orderBy: { id: 'desc' },
    });
    res.json(sessions);
  } catch (err) { next(err); }
});

// Open new session
router.post('/sessions', async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const count = await prisma.posSession.count();
    const session = await prisma.posSession.create({
      data: {
        name: `POS/Session/${String(count + 1).padStart(4, '0')}`,
        openedBy: userId,
        status: 'opened',
      },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json(session);
  } catch (err) { next(err); }
});

// Close session
router.patch('/sessions/:id/close', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const session = await prisma.posSession.update({
      where: { id },
      data: { status: 'closed', closedAt: new Date() },
    });
    res.json(session);
  } catch (err) { next(err); }
});

// List POS orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await prisma.posOrder.findMany({
      include: {
        partner: true,
        session: true,
        lines: { include: { product: true } },
      },
      orderBy: { id: 'desc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

// Create POS order & deduct inventory
router.post('/orders', async (req, res, next) => {
  try {
    const { sessionId, partnerId, paymentMode, lines } = req.body;
    let total = 0;
    (lines || []).forEach((l) => {
      total += Number(l.qty || 1) * Number(l.unitPrice || 0);
    });

    const count = await prisma.posOrder.count();
    const number = `POS-${String(count + 1).padStart(5, '0')}`;

    const order = await prisma.posOrder.create({
      data: {
        number,
        sessionId: Number(sessionId),
        partnerId: partnerId ? Number(partnerId) : null,
        amountTotal: total,
        paymentMode: paymentMode || 'cash',
        lines: {
          create: (lines || []).map((l) => ({
            productId: Number(l.productId),
            qty: Number(l.qty) || 1,
            unitPrice: Number(l.unitPrice) || 0,
          })),
        },
      },
      include: {
        partner: true,
        lines: { include: { product: true } },
      },
    });

    // Auto-deduct inventory
    for (const l of lines || []) {
      const q = Number(l.qty) || 1;
      await prisma.product.update({
        where: { id: Number(l.productId) },
        data: { stock: { decrement: q } },
      });
      await prisma.stockMove.create({
        data: {
          productId: Number(l.productId),
          qty: -q,
          type: 'out',
          reference: `POS Sale ${order.number}`,
        },
      });
    }

    res.status(201).json(order);
  } catch (err) { next(err); }
});

export default router;
