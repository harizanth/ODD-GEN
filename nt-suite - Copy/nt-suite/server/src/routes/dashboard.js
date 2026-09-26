import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const [leads, orders, invoices, products, tasks, tickets] = await Promise.all([
    prisma.lead.findMany(),
    prisma.salesOrder.findMany({ include: { lines: true } }),
    prisma.invoice.findMany(),
    prisma.product.findMany(),
    prisma.task.findMany(),
    prisma.helpdeskTicket.findMany(),
  ]);

  const pipeline = leads.filter((l) => !['won', 'lost'].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const won = leads.filter((l) => l.stage === 'won').reduce((s, l) => s + l.value, 0);
  const revenueBooked = orders.reduce((s, o) => s + o.lines.reduce((a, l) => a + l.qty * l.unitPrice, 0), 0);
  const outstanding = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
  const lowStock = products.filter((p) => p.stock < p.reorder).length;
  const openTasks = tasks.filter((t) => t.status !== 'done').length;
  const openTickets = tickets.filter((t) => !['resolved', 'closed'].includes(t.status)).length;

  const stageCounts = {};
  for (const stage of ['new', 'qualified', 'proposal', 'won', 'lost']) {
    stageCounts[stage] = leads.filter((l) => l.stage === stage).length;
  }

  res.json({
    pipeline, won, revenueBooked, outstanding, lowStock, openTasks, openTickets,
    stageCounts,
    counts: {
      contacts: await prisma.partner.count(),
      leads: leads.length,
      orders: orders.length,
      invoices: invoices.length,
      products: products.length,
    },
  });
});

export default router;
