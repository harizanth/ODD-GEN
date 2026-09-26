import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { OR: [{ userId: req.user.id }, { userId: null }] },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json(items);
});

router.put('/:id/read', async (req, res) => {
  const n = await prisma.notification.update({ where: { id: Number(req.params.id) }, data: { read: true } });
  res.json(n);
});

export default router;
