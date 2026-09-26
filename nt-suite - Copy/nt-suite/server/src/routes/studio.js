import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get custom fields and schema models
router.get('/models', async (req, res, next) => {
  try {
    const fields = await prisma.studioCustomField.findMany();
    const models = [
      { name: 'Partner', label: 'Contacts (res.partner)', recordCount: await prisma.partner.count() },
      { name: 'Lead', label: 'CRM Leads (crm.lead)', recordCount: await prisma.lead.count() },
      { name: 'SalesOrder', label: 'Sales Orders (sale.order)', recordCount: await prisma.salesOrder.count() },
      { name: 'PurchaseOrder', label: 'Purchase Orders (purchase.order)', recordCount: await prisma.purchaseOrder.count() },
      { name: 'Invoice', label: 'Invoices (account.move)', recordCount: await prisma.invoice.count() },
      { name: 'Product', label: 'Products (product.template)', recordCount: await prisma.product.count() },
      { name: 'BillOfMaterial', label: 'Bills of Material (mrp.bom)', recordCount: await prisma.billOfMaterial.count() },
      { name: 'ManufacturingOrder', label: 'Manufacturing Orders (mrp.production)', recordCount: await prisma.manufacturingOrder.count() },
      { name: 'HelpdeskTicket', label: 'Helpdesk Tickets (helpdesk.ticket)', recordCount: await prisma.helpdeskTicket.count() },
      { name: 'Employee', label: 'Employees (hr.employee)', recordCount: await prisma.employee.count() },
      { name: 'Project', label: 'Projects (project.project)', recordCount: await prisma.project.count() },
      { name: 'Task', label: 'Tasks (project.task)', recordCount: await prisma.task.count() },
      { name: 'Subscription', label: 'Subscriptions (sale.subscription)', recordCount: await prisma.subscription.count() },
    ];
    res.json({ models, customFields: fields });
  } catch (err) { next(err); }
});

// Add custom field to a model
router.post('/fields', async (req, res, next) => {
  try {
    const { modelName, fieldName, fieldType, label, required } = req.body;
    const field = await prisma.studioCustomField.create({
      data: {
        modelName,
        fieldName: fieldName.toLowerCase().replace(/\s+/g, '_'),
        fieldType: fieldType || 'char',
        label,
        required: !!required,
      },
    });
    res.status(201).json(field);
  } catch (err) { next(err); }
});

export default router;
