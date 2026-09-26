import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// List BOMs
router.get('/boms', async (req, res, next) => {
  try {
    const boms = await prisma.billOfMaterial.findMany({
      include: {
        product: true,
        components: { include: { product: true } },
        ordersProduced: true,
      },
      orderBy: { id: 'desc' },
    });
    res.json(boms);
  } catch (err) { next(err); }
});

// Create BOM
router.post('/boms', async (req, res, next) => {
  try {
    const { code, productId, qty, routing, components } = req.body;
    const bom = await prisma.billOfMaterial.create({
      data: {
        code,
        productId: Number(productId),
        qty: Number(qty) || 1,
        routing: routing || 'Standard Assembly',
        components: {
          create: (components || []).map((c) => ({
            productId: Number(c.productId),
            qtyRequired: Number(c.qtyRequired) || 1,
          })),
        },
      },
      include: { product: true, components: { include: { product: true } } },
    });
    res.status(201).json(bom);
  } catch (err) { next(err); }
});

// List Manufacturing Orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await prisma.manufacturingOrder.findMany({
      include: {
        bom: {
          include: {
            product: true,
            components: { include: { product: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

// Create Manufacturing Order
router.post('/orders', async (req, res, next) => {
  try {
    const { bomId, qty, scheduledAt } = req.body;
    const count = await prisma.manufacturingOrder.count();
    const number = `MO-${String(count + 1).padStart(4, '0')}`;

    const order = await prisma.manufacturingOrder.create({
      data: {
        number,
        bomId: Number(bomId),
        qty: Number(qty) || 1,
        status: 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      },
      include: { bom: { include: { product: true, components: { include: { product: true } } } } },
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
});

// Update MO status (confirm, in_progress, done)
async function updateMoStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.manufacturingOrder.findUnique({
      where: { id },
      include: { bom: { include: { components: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // When status changes to 'done', consume components and produce finished goods
    if (status === 'done' && order.status !== 'done') {
      for (const comp of order.bom.components) {
        const consumedQty = Math.round(comp.qtyRequired * order.qty);
        await prisma.product.update({
          where: { id: comp.productId },
          data: { stock: { decrement: consumedQty } },
        });
        await prisma.stockMove.create({
          data: {
            productId: comp.productId,
            qty: -consumedQty,
            type: 'out',
            reference: `Consumed in ${order.number}`,
          },
        });
      }

      // Add finished goods to stock
      const producedQty = Math.round(order.qty);
      await prisma.product.update({
        where: { id: order.bom.productId },
        data: { stock: { increment: producedQty } },
      });
      await prisma.stockMove.create({
        data: {
          productId: order.bom.productId,
          qty: producedQty,
          type: 'in',
          reference: `Produced by ${order.number}`,
        },
      });
    }

    const updated = await prisma.manufacturingOrder.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'done' ? new Date() : undefined,
      },
      include: { bom: { include: { product: true, components: { include: { product: true } } } } },
    });
    res.json(updated);
  } catch (err) { next(err); }
}

router.patch('/orders/:id/status', updateMoStatus);
router.put('/orders/:id/status', updateMoStatus);
router.put('/orders/:id', updateMoStatus);

export default router;
