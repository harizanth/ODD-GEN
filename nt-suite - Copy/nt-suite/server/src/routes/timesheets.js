import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

const activePunches = new Map();

router.get('/', async (req, res) => {
  const entries = await prisma.timesheet.findMany({
    include: { user: true, task: { include: { project: true } } },
    orderBy: { date: 'desc' },
  });
  res.json(entries);
});

// Check current punch status
router.get('/punch/status', (req, res) => {
  const punch = activePunches.get(req.user.id);
  res.json({
    isClockedIn: Boolean(punch),
    punch: punch || null,
  });
});

// Clock punch in / punch out
router.post('/punch', async (req, res) => {
  const { action, taskId, note } = req.body; // action: 'in' | 'out'

  if (action === 'in') {
    const punch = {
      startTime: new Date(),
      taskId: taskId ? Number(taskId) : undefined,
      note: note || 'Live work session',
    };
    activePunches.set(req.user.id, punch);
    return res.json({ status: 'clocked_in', punch, message: 'Clocked in successfully' });
  }

  if (action === 'out') {
    const punch = activePunches.get(req.user.id);
    const startTime = punch?.startTime ? new Date(punch.startTime) : new Date(Date.now() - 3600000);
    const elapsedHours = Math.max(0.1, Number(((Date.now() - startTime.getTime()) / (1000 * 60 * 60)).toFixed(2)));

    const entry = await prisma.timesheet.create({
      data: {
        userId: req.user.id,
        taskId: taskId ? Number(taskId) : punch?.taskId,
        hours: elapsedHours,
        date: new Date(),
        note: note || punch?.note || 'Completed work shift',
      },
      include: { user: true, task: { include: { project: true } } },
    });

    activePunches.delete(req.user.id);
    return res.status(201).json({
      status: 'clocked_out',
      entry,
      hours: elapsedHours,
      message: `Clocked out! Logged ${elapsedHours} hours to timesheet.`,
    });
  }

  res.status(400).json({ error: 'action must be "in" or "out"' });
});

router.post('/', async (req, res) => {
  const { taskId, hours, date, note } = req.body;
  if (!hours) return res.status(400).json({ error: 'hours is required' });
  const entry = await prisma.timesheet.create({
    data: {
      userId: req.user.id,
      taskId: taskId ? Number(taskId) : undefined,
      hours: Number(hours),
      date: date ? new Date(date) : undefined,
      note,
    },
    include: { user: true, task: { include: { project: true } } },
  });
  res.status(201).json(entry);
});

export default router;
