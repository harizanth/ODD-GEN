import { Router } from 'express';
import { prisma } from '../db.js';
import { orderNumber } from '../utils/notify.js';

const router = Router();

router.get('/orders', async (req, res) => {
  const orders = await prisma.purchaseOrder.findMany({
    include: { partner: true, lines: true },
    orderBy: { orderDate: 'desc' },
  });
  res.json(orders.map(withTotal));
});

router.post('/orders', async (req, res) => {
  const { partnerId, lines } = req.body;
  if (!partnerId || !lines?.length) return res.status(400).json({ error: 'partnerId and at least one line are required' });

  const count = await prisma.purchaseOrder.count();
  const order = await prisma.purchaseOrder.create({
    data: {
      number: orderNumber('PO', count),
      partnerId: Number(partnerId),
      status: 'draft',
      lines: {
        create: lines.map((l) => ({
          desc: l.desc,
          qty: Number(l.qty) || 1,
          unitCost: Number(l.unitCost) || 0,
          productId: l.productId ? Number(l.productId) : undefined,
        })),
      },
    },
    include: { partner: true, lines: true },
  });
  res.status(201).json(withTotal(order));
});

router.put('/orders/:id', async (req, res) => {
  const order = await prisma.purchaseOrder.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status },
    include: { partner: true, lines: true },
  });

  // Receiving a PO restocks inventory automatically and creates Vendor Bill
  if (req.body.status === 'received') {
    for (const line of order.lines) {
      if (!line.productId) continue;
      await prisma.product.update({
        where: { id: line.productId },
        data: { stock: { increment: Math.round(line.qty) } },
      });
      await prisma.stockMove.create({
        data: { productId: line.productId, qty: Math.round(line.qty), type: 'in', reference: order.number },
      });
    }

    // Auto-generate vendor bill for accounting
    const billCount = await prisma.invoice.count();
    const totalCost = order.lines.reduce((s, l) => s + l.qty * l.unitCost, 0);
    await prisma.invoice.create({
      data: {
        number: `BILL-${String(billCount + 1).padStart(4, '0')}`,
        type: 'in_invoice',
        partnerId: order.partnerId,
        amount: totalCost,
        status: 'unpaid',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Net 15 days
      },
    }).catch(() => {});
  }
  res.json(withTotal(order));
});

function withTotal(order) {
  const total = order.lines.reduce((s, l) => s + l.qty * l.unitCost, 0);
  return { ...order, total };
}

export default router;
