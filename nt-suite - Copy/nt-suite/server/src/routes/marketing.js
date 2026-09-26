import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// List campaigns
router.get('/campaigns', async (req, res, next) => {
  try {
    let campaigns = await prisma.emailCampaign.findMany({
      orderBy: { id: 'desc' },
    });
    if (campaigns.length === 0) {
      await prisma.emailCampaign.createMany({
        data: [
          {
            title: 'Q3 Product Release Newsletter',
            subject: 'Exciting news: All-new enterprise features are live!',
            target: 'Customers',
            status: 'sent',
            sentCount: 1420,
            opened: 840,
            clicked: 312,
            sentAt: new Date(),
            body: 'Hello valued partner, we are proud to announce major upgrades in our business suite...',
          },
          {
            title: 'Early Bird Annual Discount',
            subject: 'Save 25% on your annual enterprise subscription',
            target: 'Leads',
            status: 'queued',
            sentCount: 0,
            opened: 0,
            clicked: 0,
            body: 'Upgrade your monthly plan today to lock in 25% savings...',
          },
        ],
      });
      campaigns = await prisma.emailCampaign.findMany({ orderBy: { id: 'desc' } });
    }
    res.json(campaigns);
  } catch (err) { next(err); }
});

// Create campaign
router.post('/campaigns', async (req, res, next) => {
  try {
    const { title, subject, target, body } = req.body;
    const campaign = await prisma.emailCampaign.create({
      data: {
        title,
        subject,
        target: target || 'Customers',
        body,
        status: 'draft',
      },
    });
    res.status(201).json(campaign);
  } catch (err) { next(err); }
});

// Send campaign simulation
router.post('/campaigns/:id/send', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const partnerCount = await prisma.partner.count();
    const sentCount = Math.max(partnerCount, 25);
    const opened = Math.round(sentCount * 0.42);
    const clicked = Math.round(opened * 0.35);

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'sent',
        sentCount,
        opened,
        clicked,
        sentAt: new Date(),
      },
    });
    res.json(campaign);
  } catch (err) { next(err); }
});

export default router;
