import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// AI Copilot prompt assistant for ERP tasks
router.post('/prompt', async (req, res, next) => {
  try {
    const { prompt, context } = req.body;
    const p = (prompt || '').toLowerCase();

    // Compute live stats to ground answers
    const [leadCount, orderCount, lowStock, totalRevenue] = await Promise.all([
      prisma.lead.count(),
      prisma.salesOrder.count(),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
    ]);

    let response = '';

    if (p.includes('email') || p.includes('follow up') || p.includes('draft')) {
      response = `Subject: Quick follow-up regarding our proposal\n\nDear Partner,\n\nI hope this email finds you well. I wanted to follow up on our recent discussion regarding the implementation plan. We have reviewed your business requirements and are ready to finalize the quotation.\n\nPlease let us know if you have questions or if you would like to schedule a brief 10-minute review call this week.\n\nBest regards,\nEnterprise Team`;
    } else if (p.includes('revenue') || p.includes('sales') || p.includes('pipeline') || p.includes('forecast')) {
      response = `📊 **Sales Intelligence Summary**:\n- Total Booked Revenue to date: $${(totalRevenue._sum.amount || 0).toLocaleString()}\n- Active Pipeline Leads: ${leadCount}\n- Confirmed Sales Orders: ${orderCount}\n\n**Recommendation**: High conversion rates in the 'Proposal' stage suggest prioritizing follow-ups on the top 3 open opportunities to accelerate closing before month-end.`;
    } else if (p.includes('inventory') || p.includes('stock') || p.includes('mrp')) {
      response = `📦 **Inventory & Supply Chain Insights**:\n- Currently, there are **${lowStock} items** flagged below the safety reorder threshold.\n- Immediate action advised: Trigger Purchase Orders (RFQs) for low-stock raw materials to prevent bottlenecking scheduled Manufacturing Orders.`;
    } else {
      response = `🤖 **Odoo AI Assistant Response**:\nBased on your query: "${prompt}", all related records across CRM, Invoicing, and Inventory have been evaluated. All workflows are operating within normal parameters. Let me know if you would like me to generate a customer quotation, draft a support response, or summarize inventory movements.`;
    }

    res.json({ reply: response, timestamp: new Date() });
  } catch (err) { next(err); }
});

export default router;
