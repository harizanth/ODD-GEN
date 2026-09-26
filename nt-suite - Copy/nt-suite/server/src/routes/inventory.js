import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  res.json(products);
});

router.post('/products', async (req, res) => {
  const { sku, name, category, price, cost, stock, reorder, uom } = req.body;
  if (!sku || !name) return res.status(400).json({ error: 'sku and name are required' });
  const product = await prisma.product.create({
    data: {
      sku, name,
      category: category || 'General',
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      reorder: Number(reorder) || 10,
      uom: uom || 'unit',
    },
  });
  res.status(201).json(product);
});

router.post('/products/:id/adjust', async (req, res) => {
  const productId = Number(req.params.id);
  const delta = Number(req.body.delta) || 0;
  const product = await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: delta } },
  });
  await prisma.stockMove.create({
    data: { productId, qty: Math.abs(delta), type: delta >= 0 ? 'in' : 'out', reference: 'Manual adjustment' },
  });
  res.json(product);
});

router.get('/moves', async (req, res) => {
  const moves = await prisma.stockMove.findMany({
    include: { product: true },
    orderBy: { date: 'desc' },
    take: 50,
  });
  res.json(moves);
});

export default router;
