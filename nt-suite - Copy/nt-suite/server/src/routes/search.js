import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);

  const [partners, leads, products, tickets] = await Promise.all([
    prisma.partner.findMany({ where: { name: { contains: q } }, take: 5 }),
    prisma.lead.findMany({ where: { name: { contains: q } }, take: 5 }),
    prisma.product.findMany({ where: { name: { contains: q } }, take: 5 }),
    prisma.helpdeskTicket.findMany({ where: { subject: { contains: q } }, take: 5 }),
  ]);

  const results = [
    ...partners.map((p) => ({ type: 'contact', id: p.id, label: p.name, module: 'contacts' })),
    ...leads.map((l) => ({ type: 'lead', id: l.id, label: l.name, module: 'crm' })),
    ...products.map((p) => ({ type: 'product', id: p.id, label: p.name, module: 'inventory' })),
    ...tickets.map((t) => ({ type: 'ticket', id: t.id, label: t.subject, module: 'helpdesk' })),
  ];
  res.json(results);
});

export default router;
