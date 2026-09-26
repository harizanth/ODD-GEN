import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

const SLA_HOURS = {
  urgent: 4,
  high: 8,
  normal: 24,
  low: 48,
};

function withSLA(ticket) {
  const targetHours = SLA_HOURS[ticket.priority] || 24;
  const createdAtTime = new Date(ticket.createdAt).getTime();
  const deadline = new Date(createdAtTime + targetHours * 3600 * 1000);
  const now = Date.now();
  const remainingHours = Number(((deadline.getTime() - now) / 3600000).toFixed(1));
  const isBreached = ticket.status !== 'resolved' && ticket.status !== 'closed' && remainingHours < 0;

  return {
    ...ticket,
    slaTargetHours: targetHours,
    slaDeadline: deadline,
    slaRemainingHours: remainingHours,
    slaStatus: isBreached ? 'breached' : remainingHours < 2 ? 'warning' : 'within_sla',
  };
}

router.get('/tickets', async (req, res) => {
  const tickets = await prisma.helpdeskTicket.findMany({
    include: { partner: true, assignee: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tickets.map(withSLA));
});

router.post('/tickets', async (req, res) => {
  const { subject, partnerId, priority, description } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject is required' });
  const ticket = await prisma.helpdeskTicket.create({
    data: {
      subject,
      partnerId: partnerId ? Number(partnerId) : undefined,
      priority: priority || 'normal',
      description,
      assigneeId: req.user.id,
    },
    include: { partner: true, assignee: true },
  });
  res.status(201).json(withSLA(ticket));
});

router.put('/tickets/:id', async (req, res) => {
  const ticket = await prisma.helpdeskTicket.update({
    where: { id: Number(req.params.id) },
    data: req.body,
    include: { partner: true, assignee: true },
  });
  res.json(withSLA(ticket));
});

// Customer Satisfaction (CSAT) rating
router.post('/tickets/:id/rate', async (req, res) => {
  const { rating, feedback } = req.body; // rating: 1 to 5
  const ticketId = Number(req.params.id);

  await prisma.recordActivity.create({
    data: {
      resModel: 'HelpdeskTicket',
      resId: ticketId,
      type: 'note',
      summary: `CSAT Rating: ${rating}/5 ⭐ — Feedback: ${feedback || 'No comments'}`,
      userId: req.user.id,
    },
  }).catch(() => {});

  res.json({
    ticketId,
    rating,
    feedback,
    message: 'Thank you for your rating! Feedback recorded.',
  });
});

export default router;
