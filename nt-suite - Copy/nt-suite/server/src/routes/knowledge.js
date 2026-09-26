import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const articles = await prisma.knowledgeArticle.findMany({
    include: { author: true },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(articles);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const article = await prisma.knowledgeArticle.create({
    data: { title, content: content || '', authorId: req.user.id },
    include: { author: true },
  });
  res.status(201).json(article);
});

router.put('/:id', async (req, res) => {
  const article = await prisma.knowledgeArticle.update({
    where: { id: Number(req.params.id) },
    data: { title: req.body.title, content: req.body.content },
    include: { author: true },
  });
  res.json(article);
});

router.delete('/:id', async (req, res) => {
  await prisma.knowledgeArticle.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
