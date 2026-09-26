import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get all channels
router.get('/channels', async (req, res, next) => {
  try {
    let channels = await prisma.chatChannel.findMany({
      include: {
        messages: {
          include: { user: { select: { id: true, name: true, email: true, color: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    if (channels.length === 0) {
      // Seed default channels if empty
      await prisma.chatChannel.createMany({
        data: [
          { name: 'general', type: 'public', description: 'Company-wide announcements and chatter' },
          { name: 'sales', type: 'public', description: 'Sales opportunities, leads & won deals' },
          { name: 'projects', type: 'public', description: 'Operational tasks and delivery updates' },
        ],
      });
      channels = await prisma.chatChannel.findMany({
        include: {
          messages: {
            include: { user: { select: { id: true, name: true, email: true, color: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    res.json(channels);
  } catch (err) { next(err); }
});

// Create a new channel
router.post('/channels', async (req, res, next) => {
  try {
    const { name, type, description } = req.body;
    const channel = await prisma.chatChannel.create({
      data: {
        name: name.toLowerCase().replace(/\s+/g, '-'),
        type: type || 'public',
        description,
      },
    });
    res.status(201).json(channel);
  } catch (err) { next(err); }
});

// Post a message to a channel
router.post('/channels/:id/messages', async (req, res, next) => {
  try {
    const channelId = Number(req.params.id);
    const userId = req.user?.id || 1;
    const { content } = req.body;

    const message = await prisma.chatMessage.create({
      data: {
        channelId,
        userId,
        content,
      },
      include: {
        user: { select: { id: true, name: true, email: true, color: true } },
      },
    });
    res.status(201).json(message);
  } catch (err) { next(err); }
});

export default router;
