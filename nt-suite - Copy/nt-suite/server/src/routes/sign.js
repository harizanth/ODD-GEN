import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// List signature requests
router.get('/', async (req, res, next) => {
  try {
    const requests = await prisma.signatureRequest.findMany({
      include: {
        partner: true,
        requester: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: 'desc' },
    });
    res.json(requests);
  } catch (err) { next(err); }
});

// Create signature request
router.post('/', async (req, res, next) => {
  try {
    const { title, partnerId } = req.body;
    const requesterId = req.user?.id || 1;

    const request = await prisma.signatureRequest.create({
      data: {
        title,
        partnerId: Number(partnerId),
        requesterId,
        status: 'pending',
      },
      include: {
        partner: true,
        requester: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(request);
  } catch (err) { next(err); }
});

// Sign document
router.post('/:id/sign', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { signature } = req.body;

    const request = await prisma.signatureRequest.update({
      where: { id },
      data: {
        signature,
        status: 'signed',
        signedAt: new Date(),
      },
      include: {
        partner: true,
        requester: { select: { id: true, name: true } },
      },
    });
    res.json(request);
  } catch (err) { next(err); }
});

export default router;
