import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Field Service Orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await prisma.fieldServiceOrder.findMany({
      include: {
        partner: true,
        technician: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: 'desc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

router.post('/orders', async (req, res, next) => {
  try {
    const { title, partnerId, technicianId, priority, location, scheduledFor, notes } = req.body;
    const count = await prisma.fieldServiceOrder.count();
    const number = `FSO-${String(count + 1).padStart(4, '0')}`;

    const order = await prisma.fieldServiceOrder.create({
      data: {
        number,
        title,
        partnerId: Number(partnerId),
        technicianId: technicianId ? Number(technicianId) : null,
        priority: priority || 'normal',
        location,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        notes,
      },
      include: { partner: true, technician: true },
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
});

async function updateFieldOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const order = await prisma.fieldServiceOrder.update({
      where: { id },
      data: { status },
      include: { partner: true, technician: true },
    });
    res.json(order);
  } catch (err) { next(err); }
}

router.patch('/orders/:id/status', updateFieldOrderStatus);
router.put('/orders/:id/status', updateFieldOrderStatus);
router.put('/orders/:id', updateFieldOrderStatus);

// Planning Shifts
router.get('/shifts', async (req, res, next) => {
  try {
    let shifts = await prisma.planningShift.findMany({
      orderBy: { startTime: 'asc' },
    });
    if (shifts.length === 0) {
      const now = new Date();
      shifts = await prisma.planningShift.createMany({
        data: [
          {
            title: 'On-site Fiber Diagnostic',
            role: 'Senior Network Technician',
            userEmail: 'alex@ntos.dev',
            startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
            endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0),
            allocated: 8.0,
            status: 'published',
          },
          {
            title: 'Warehouse Rack Setup',
            role: 'Hardware Specialist',
            userEmail: 'dev@ntos.dev',
            startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
            endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0),
            allocated: 6.0,
            status: 'published',
          },
        ],
      });
      shifts = await prisma.planningShift.findMany({ orderBy: { startTime: 'asc' } });
    }
    res.json(shifts);
  } catch (err) { next(err); }
});

router.post('/shifts', async (req, res, next) => {
  try {
    const { title, role, userEmail, startTime, endTime, allocated } = req.body;
    const shift = await prisma.planningShift.create({
      data: {
        title,
        role: role || 'Technician',
        userEmail,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        allocated: Number(allocated) || 8,
        status: 'published',
      },
    });
    res.status(201).json(shift);
  } catch (err) { next(err); }
});

export default router;
