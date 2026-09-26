import { Router } from 'express';
import { prisma } from '../db.js';
import { orderNumber } from '../utils/notify.js';

const router = Router();

router.get('/orders', async (req, res) => {
  const orders = await prisma.salesOrder.findMany({
    include: { partner: true, lines: true },
    orderBy: { orderDate: 'desc' },
  });
  res.json(orders.map(withTotal));
});

router.post('/orders', async (req, res) => {
  const { partnerId, lines } = req.body;
  if (!partnerId || !lines?.length) return res.status(400).json({ error: 'partnerId and at least one line are required' });

  const count = await prisma.salesOrder.count();
  const order = await prisma.salesOrder.create({
    data: {
      number: orderNumber('SO', count),
      partnerId: Number(partnerId),
      status: 'draft',
      lines: {
        create: lines.map((l) => ({
          desc: l.desc,
          qty: Number(l.qty) || 1,
          unitPrice: Number(l.unitPrice) || 0,
          productId: l.productId ? Number(l.productId) : undefined,
        })),
      },
    },
    include: { partner: true, lines: true },
  });
  res.status(201).json(withTotal(order));
});

router.put('/orders/:id', async (req, res) => {
  const { status } = req.body;
  const orderId = Number(req.params.id);

  const prevOrder = await prisma.salesOrder.findUnique({
    where: { id: orderId },
    include: { lines: true, partner: true },
  });
  if (!prevOrder) return res.status(404).json({ error: 'Order not found' });

  // 1. If confirming order: reserve / deduct stock for storable products
  if (status === 'confirmed' && prevOrder.status !== 'confirmed') {
    for (const line of prevOrder.lines) {
      if (line.productId) {
        await prisma.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: Math.round(line.qty) } },
        }).catch(() => {});

        await prisma.stockMove.create({
          data: {
            productId: line.productId,
            qty: -Math.round(line.qty),
            type: 'out',
            reference: `Delivery for ${prevOrder.number}`,
          },
        }).catch(() => {});
      }
    }
  }

  // 2. If invoicing order: auto-generate customer Invoice
  if (status === 'invoiced' && prevOrder.status !== 'invoiced') {
    const existingInv = await prisma.invoice.findFirst({
      where: { salesOrderId: orderId },
    });
    if (!existingInv) {
      const invCount = await prisma.invoice.count();
      const total = prevOrder.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
      await prisma.invoice.create({
        data: {
          number: `INV-${String(invCount + 1).padStart(4, '0')}`,
          type: 'out_invoice',
          partnerId: prevOrder.partnerId,
          salesOrderId: orderId,
          amount: total,
          status: 'unpaid',
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30 days
        },
      });
    }
  }

  const order = await prisma.salesOrder.update({
    where: { id: orderId },
    data: { status },
    include: { partner: true, lines: true },
  });
  res.json(withTotal(order));
});

// Explicit 1-Click Invoice Generation Route
router.post('/orders/:id/invoice', async (req, res) => {
  const orderId = Number(req.params.id);
  const order = await prisma.salesOrder.findUnique({
    where: { id: orderId },
    include: { lines: true, partner: true },
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const total = order.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const invCount = await prisma.invoice.count();
  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-${String(invCount + 1).padStart(4, '0')}`,
      type: 'out_invoice',
      partnerId: order.partnerId,
      salesOrderId: order.id,
      amount: total,
      status: 'unpaid',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.salesOrder.update({
    where: { id: orderId },
    data: { status: 'invoiced' },
  });

  res.status(201).json({ invoice, message: `Created invoice ${invoice.number} for ${order.number}` });
});

function withTotal(order) {
  const total = order.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  return { ...order, total };
}

export default router;
