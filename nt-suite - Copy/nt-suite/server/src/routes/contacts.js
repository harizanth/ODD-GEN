import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { type, q } = req.query;
  const where = {};
  if (type) where.type = type;
  if (q) where.OR = [
    { name: { contains: q } },
    { email: { contains: q } },
    { company: { contains: q } },
  ];
  const partners = await prisma.partner.findMany({ where, orderBy: { name: 'asc' } });
  res.json(partners);
});

router.get('/:id', async (req, res) => {
  const partner = await prisma.partner.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      leads: true,
      salesOrders: true,
      purchaseOrders: true,
      invoices: true,
      tickets: true,
    },
  });
  if (!partner) return res.status(404).json({ error: 'Contact not found' });
  res.json(partner);
});

router.post('/', async (req, res) => {
  const { name, email, phone, company, type, address, city, country, tags, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const partner = await prisma.partner.create({
    data: { name, email, phone, company, type: type || 'customer', address, city, country, tags, notes },
  });
  res.status(201).json(partner);
});

router.put('/:id', async (req, res) => {
  const partner = await prisma.partner.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(partner);
});

router.delete('/:id', async (req, res) => {
  await prisma.partner.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
