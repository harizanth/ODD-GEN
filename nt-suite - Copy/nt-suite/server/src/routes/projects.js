import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { partner: true, tasks: { include: { assignee: true } } },
    orderBy: { id: 'desc' },
  });
  res.json(projects);
});

router.post('/', async (req, res) => {
  const { name, partnerId, deadline } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const project = await prisma.project.create({
    data: {
      name,
      partnerId: partnerId ? Number(partnerId) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
    },
  });
  res.status(201).json(project);
});

router.post('/:id/tasks', async (req, res) => {
  const { title, priority, dueDate, assigneeId } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = await prisma.task.create({
    data: {
      projectId: Number(req.params.id),
      title,
      priority: priority || 'normal',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
      status: 'todo',
    },
    include: { assignee: true },
  });
  res.status(201).json(task);
});

router.put('/tasks/:id', async (req, res) => {
  const { blockedReason, ...data } = req.body;
  const taskId = Number(req.params.id);

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: { assignee: true },
  });

  if (data.status === 'blocked') {
    await prisma.recordActivity.create({
      data: {
        resModel: 'Task',
        resId: taskId,
        type: 'note',
        summary: `Task Blocked: ${blockedReason || 'Blocked on dependency'}`,
        userId: req.user.id,
      },
    }).catch(() => {});
  }

  res.json(task);
});

export default router;
