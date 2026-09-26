import { Router } from 'express';
import { prisma } from '../db.js';
import { orderNumber } from '../utils/notify.js';

const router = Router();

router.get('/invoices', async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    include: { partner: true, payments: true, salesOrder: true },
    orderBy: { issueDate: 'desc' },
  });
  const today = new Date();
  const withComputedStatus = invoices.map((inv) => {
    if (inv.status === 'unpaid' && new Date(inv.dueDate) < today) {
      return { ...inv, status: 'overdue' };
    }
    return inv;
  });
  res.json(withComputedStatus);
});

router.post('/invoices', async (req, res) => {
  const { partnerId, amount, dueDate, salesOrderId } = req.body;
  if (!partnerId || !amount || !dueDate) return res.status(400).json({ error: 'partnerId, amount, dueDate are required' });

  const count = await prisma.invoice.count();
  const invoice = await prisma.invoice.create({
    data: {
      number: orderNumber('INV', count),
      partnerId: Number(partnerId),
      amount: Number(amount),
      dueDate: new Date(dueDate),
      status: 'unpaid',
      salesOrderId: salesOrderId ? Number(salesOrderId) : undefined,
    },
    include: { partner: true, payments: true, salesOrder: true },
  });
  res.status(201).json(invoice);
});

// Explicit 1-Click Invoice Generation from Sales Order (mounted under /invoicing)
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
    include: { partner: true, payments: true, salesOrder: true },
  });

  await prisma.salesOrder.update({
    where: { id: orderId },
    data: { status: 'invoiced' },
  });

  res.status(201).json({ invoice, message: `Created invoice ${invoice.number} for ${order.number}` });
});

// Payment Registration (Supports both /invoices/:id/payments and /invoices/:id/pay)
async function handlePayment(req, res) {
  const invoiceId = Number(req.params.id);
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  await prisma.payment.create({
    data: { invoiceId, amount: Number(req.body.amount) || invoice.amount, method: req.body.method || 'bank' },
  });
  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: 'paid' },
    include: { partner: true, payments: true, salesOrder: true },
  });
  res.json(updated);
}

router.post('/invoices/:id/pay', handlePayment);
router.post('/invoices/:id/payments', handlePayment);

export default router;

