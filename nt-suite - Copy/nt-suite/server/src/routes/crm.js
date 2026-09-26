import { Router } from 'express';
import { prisma } from '../db.js';
import { notify } from '../utils/notify.js';

const router = Router();

router.get('/leads', async (req, res) => {
  const leads = await prisma.lead.findMany({
    include: { owner: true, partner: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(leads);
});

router.post('/leads', async (req, res) => {
  const { name, company, value, source, notes, partnerId } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const lead = await prisma.lead.create({
    data: {
      name,
      company,
      value: Number(value) || 0,
      source,
      notes,
      stage: 'new',
      ownerId: req.user.id,
      partnerId: partnerId ? Number(partnerId) : undefined,
    },
    include: { owner: true },
  });
  res.status(201).json(lead);
});

router.put('/leads/:id', async (req, res) => {
  const data = { ...req.body };
  if (data.value !== undefined) data.value = Number(data.value);
  const lead = await prisma.lead.update({
    where: { id: Number(req.params.id) },
    data,
    include: { owner: true },
  });
  if (data.stage) {
    await notify(req.user.id, `Lead "${lead.name}" moved to ${data.stage}`);
  }
  res.json(lead);
});

router.delete('/leads/:id', async (req, res) => {
  await prisma.lead.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

// 1-Click Convert Lead to Customer & Sales Quotation
router.post('/leads/:id/convert', async (req, res) => {
  const leadId = Number(req.params.id);
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { partner: true },
  });
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  // 1. Ensure Partner exists
  let partnerId = lead.partnerId;
  if (!partnerId) {
    const newPartner = await prisma.partner.create({
      data: {
        name: lead.name,
        company: lead.company,
        type: 'customer',
        notes: `Converted from Lead #${lead.id}: ${lead.notes || ''}`,
      },
    });
    partnerId = newPartner.id;
  }

  // 2. Generate Sales Quotation (draft SalesOrder)
  const count = await prisma.salesOrder.count();
  const orderNumber = `SO-${String(count + 1).padStart(4, '0')}`;
  const salesOrder = await prisma.salesOrder.create({
    data: {
      number: orderNumber,
      partnerId,
      status: 'draft',
      amountTotal: lead.value || 0,
      lines: {
        create: [
          {
            desc: `Contract / Scope: ${lead.name}`,
            qty: 1,
            unitPrice: lead.value || 0,
          },
        ],
      },
    },
    include: { partner: true, lines: true },
  });

  // 3. Move Lead to 'won' and link partner
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      stage: 'won',
      probability: 100,
      partnerId,
    },
    include: { owner: true, partner: true },
  });

  await notify(
    req.user.id,
    `Converted Lead "${lead.name}" to Quotation ${salesOrder.number} ($${lead.value})`
  );

  res.json({
    lead: updatedLead,
    partnerId,
    salesOrder,
    message: `Successfully converted lead into Customer and Sales Quotation ${salesOrder.number}`,
  });
});

export default router;
