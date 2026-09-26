import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/events', async (req, res) => {
  const events = await prisma.calendarEvent.findMany({ include: { partner: true }, orderBy: { start: 'asc' } });
  res.json(events);
});

router.post('/events', async (req, res) => {
  const { title, start, end, allDay, partnerId, notes } = req.body;
  if (!title || !start || !end) return res.status(400).json({ error: 'title, start, end are required' });
  const event = await prisma.calendarEvent.create({
    data: {
      title,
      start: new Date(start),
      end: new Date(end),
      allDay: !!allDay,
      partnerId: partnerId ? Number(partnerId) : undefined,
      notes,
    },
  });
  res.status(201).json(event);
});

router.delete('/events/:id', async (req, res) => {
  await prisma.calendarEvent.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
