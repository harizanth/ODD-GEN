import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NT/OS Enterprise Suite...');

  // Wipe existing data (order matters for FK constraints)
  await prisma.recordActivity.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatChannel.deleteMany();
  await prisma.signatureRequest.deleteMany();
  await prisma.planningShift.deleteMany();
  await prisma.fieldServiceOrder.deleteMany();
  await prisma.emailCampaign.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.posOrderLine.deleteMany();
  await prisma.posOrder.deleteMany();
  await prisma.posSession.deleteMany();
  await prisma.manufacturingOrder.deleteMany();
  await prisma.bOMComponent.deleteMany();
  await prisma.billOfMaterial.deleteMany();
  await prisma.studioCustomField.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.salesOrderLine.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.purchaseOrderLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.stockMove.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.helpdeskTicket.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const admin = await prisma.user.create({ data: { name: 'Administrator', email: 'admin@ntos.dev', passwordHash, role: 'admin', color: '#714B67' } });
  const jasper = await prisma.user.create({ data: { name: 'Jasper Solari', email: 'jasper@ntos.dev', passwordHash, role: 'manager', color: '#017E84' } });
  const mika = await prisma.user.create({ data: { name: 'Mika Kessler', email: 'mika@ntos.dev', passwordHash, role: 'user', color: '#E67E22' } });
  const renataUser = await prisma.user.create({ data: { name: 'Renata Voss', email: 'renata@ntos.dev', passwordHash, role: 'user', color: '#28A745' } });

  // --- Contacts ---
  const [aria, northwind, bluepeak, solace, kestrel, verve, acmeSupply, primeParts, globalLogistics, techVista] = await Promise.all([
    prisma.partner.create({ data: { name: 'Aria Fintech', email: 'ops@ariafintech.com', company: 'Aria Fintech', type: 'customer', city: 'Austin', country: 'United States', phone: '+1 (512) 555-0142', tags: 'fintech,enterprise' } }),
    prisma.partner.create({ data: { name: 'Northwind Supplies', email: 'hello@northwind.co', company: 'Northwind', type: 'customer', city: 'Seattle', country: 'United States', phone: '+1 (206) 555-0198', tags: 'wholesale,supplies' } }),
    prisma.partner.create({ data: { name: 'Bluepeak Analytics', email: 'contact@bluepeak.io', company: 'Bluepeak', type: 'customer', city: 'Denver', country: 'United States', phone: '+1 (303) 555-0176', tags: 'analytics,saas' } }),
    prisma.partner.create({ data: { name: 'Solace Studio', email: 'team@solace.studio', company: 'Solace', type: 'customer', city: 'Toronto', country: 'Canada', phone: '+1 (416) 555-0133', tags: 'design,creative' } }),
    prisma.partner.create({ data: { name: 'Kestrel Logistics', email: 'info@kestrel.com', company: 'Kestrel', type: 'customer', city: 'Chicago', country: 'United States', phone: '+1 (312) 555-0157', tags: 'logistics,shipping' } }),
    prisma.partner.create({ data: { name: 'Verve Media', email: 'hi@verve.media', company: 'Verve', type: 'customer', city: 'Miami', country: 'United States', phone: '+1 (305) 555-0119', tags: 'media,marketing' } }),
    prisma.partner.create({ data: { name: 'Acme Supply Co.', email: 'sales@acmesupply.com', company: 'Acme Supply', type: 'vendor', city: 'Newark', country: 'United States', phone: '+1 (973) 555-0165', tags: 'supplier,materials' } }),
    prisma.partner.create({ data: { name: 'Prime Parts Ltd.', email: 'orders@primeparts.com', company: 'Prime Parts', type: 'vendor', city: 'Coimbatore', country: 'India', phone: '+91 422 555-0188', tags: 'supplier,components' } }),
    prisma.partner.create({ data: { name: 'Global Logistics Inc.', email: 'dispatch@globallog.com', company: 'Global Logistics', type: 'vendor', city: 'Rotterdam', country: 'Netherlands', phone: '+31 10 555 0199', tags: 'shipping,freight' } }),
    prisma.partner.create({ data: { name: 'TechVista Solutions', email: 'sales@techvista.io', company: 'TechVista', type: 'customer', city: 'Bangalore', country: 'India', phone: '+91 80 555 0122', tags: 'technology,consulting' } }),
  ]);

  // --- CRM Leads ---
  await prisma.lead.createMany({
    data: [
      { name: 'Aria Fintech — Enterprise Onboarding', partnerId: aria.id, company: 'Aria Fintech', value: 18500, stage: 'new', probability: 30, source: 'Referral', ownerId: jasper.id },
      { name: 'Northwind Supplies Annual Contract', partnerId: northwind.id, company: 'Northwind', value: 42000, stage: 'qualified', probability: 55, source: 'Outbound', ownerId: mika.id },
      { name: 'Bluepeak Analytics Renewal', partnerId: bluepeak.id, company: 'Bluepeak', value: 9800, stage: 'proposal', probability: 75, source: 'Website', ownerId: admin.id },
      { name: 'Solace Studio Retainer Deal', partnerId: solace.id, company: 'Solace', value: 26000, stage: 'won', probability: 100, source: 'Referral', ownerId: jasper.id },
      { name: 'Kestrel Logistics Pilot Program', partnerId: kestrel.id, company: 'Kestrel', value: 15400, stage: 'new', probability: 20, source: 'Cold call', ownerId: mika.id },
      { name: 'Verve Media Campaign Package', partnerId: verve.id, company: 'Verve', value: 7200, stage: 'lost', probability: 0, source: 'Website', ownerId: admin.id },
      { name: 'TechVista Consulting Platform', partnerId: techVista.id, company: 'TechVista', value: 34000, stage: 'qualified', probability: 45, source: 'LinkedIn', ownerId: jasper.id },
      { name: 'Global Logistics Integration', partnerId: globalLogistics.id, company: 'Global Logistics', value: 58000, stage: 'proposal', probability: 60, source: 'Trade show', ownerId: admin.id },
    ],
  });

  // --- Products ---
  const desk = await prisma.product.create({ data: { sku: 'FURN-001', name: 'Modular Desk Frame', category: 'Furniture', price: 210, cost: 120, stock: 142, reorder: 50, uom: 'Units', type: 'storable', description: 'Adjustable modular desk frame with cable management' } });
  const chair = await prisma.product.create({ data: { sku: 'FURN-002', name: 'Carbon Task Chair', category: 'Furniture', price: 340, cost: 190, stock: 18, reorder: 25, uom: 'Units', type: 'storable', description: 'Ergonomic carbon fiber task chair' } });
  const lamp = await prisma.product.create({ data: { sku: 'ELEC-001', name: 'Glyph Desk Lamp', category: 'Electronics', price: 64, cost: 30, stock: 6, reorder: 20, uom: 'Units', type: 'storable', description: 'USB-C powered LED desk lamp' } });
  const tray = await prisma.product.create({ data: { sku: 'ACC-001', name: 'Mono Keyboard Tray', category: 'Accessories', price: 39, cost: 18, stock: 88, reorder: 30, uom: 'Units', type: 'storable', description: 'Sliding keyboard tray with wrist rest' } });
  const monitor = await prisma.product.create({ data: { sku: 'ELEC-002', name: '4K Ultra Monitor', category: 'Electronics', price: 549, cost: 320, stock: 35, reorder: 15, uom: 'Units', type: 'storable', description: '32-inch 4K IPS display with USB-C hub' } });
  const headset = await prisma.product.create({ data: { sku: 'ELEC-003', name: 'Wireless Headset Pro', category: 'Electronics', price: 129, cost: 65, stock: 72, reorder: 20, uom: 'Units', type: 'storable', description: 'Active noise cancelling wireless headset' } });
  const consulting = await prisma.product.create({ data: { sku: 'SVC-001', name: 'Consulting Hour', category: 'Services', price: 150, cost: 0, stock: 0, reorder: 0, uom: 'Hours', type: 'service', description: 'Professional consulting service per hour' } });
  const support = await prisma.product.create({ data: { sku: 'SVC-002', name: 'Premium Support Plan', category: 'Services', price: 299, cost: 0, stock: 0, reorder: 0, uom: 'Units', type: 'service', description: 'Annual premium support subscription' } });

  await prisma.stockMove.createMany({
    data: [
      { productId: desk.id, qty: 50, type: 'in', reference: 'PO-2001' },
      { productId: chair.id, qty: 12, type: 'out', reference: 'SO-1040' },
      { productId: lamp.id, qty: 5, type: 'out', reference: 'SO-1042' },
      { productId: monitor.id, qty: 20, type: 'in', reference: 'PO-2003' },
      { productId: headset.id, qty: 30, type: 'in', reference: 'PO-2004' },
      { productId: tray.id, qty: 10, type: 'adjustment', reference: 'ADJ-001' },
    ],
  });

  // --- Sales Orders ---
  const so1 = await prisma.salesOrder.create({
    data: {
      number: 'SO-1042', partnerId: aria.id, status: 'confirmed', amountTotal: 10960,
      lines: { create: [
        { desc: 'Modular Desk Frame', qty: 40, unitPrice: 210, productId: desk.id },
        { desc: 'Glyph Desk Lamp', qty: 40, unitPrice: 64, productId: lamp.id },
      ]},
    },
  });
  const so2 = await prisma.salesOrder.create({
    data: { number: 'SO-1041', partnerId: northwind.id, status: 'draft', amountTotal: 34000,
      lines: { create: [{ desc: 'Carbon Task Chair', qty: 100, unitPrice: 340, productId: chair.id }] } },
  });
  const so3 = await prisma.salesOrder.create({
    data: { number: 'SO-1040', partnerId: bluepeak.id, status: 'shipped', amountTotal: 4080,
      lines: { create: [{ desc: 'Carbon Task Chair', qty: 12, unitPrice: 340, productId: chair.id }] } },
  });
  await prisma.salesOrder.create({
    data: { number: 'SO-1039', partnerId: solace.id, status: 'invoiced', amountTotal: 7800,
      lines: { create: [{ desc: 'Mono Keyboard Tray', qty: 200, unitPrice: 39, productId: tray.id }] } },
  });
  await prisma.salesOrder.create({
    data: { number: 'SO-1038', partnerId: techVista.id, status: 'confirmed', amountTotal: 16470,
      lines: { create: [
        { desc: '4K Ultra Monitor', qty: 10, unitPrice: 549, productId: monitor.id },
        { desc: 'Wireless Headset Pro', qty: 50, unitPrice: 129, productId: headset.id },
      ]},
    },
  });

  // --- Purchase Orders ---
  await prisma.purchaseOrder.create({
    data: { number: 'PO-2001', partnerId: acmeSupply.id, status: 'confirmed', amountTotal: 13000,
      lines: { create: [{ desc: 'Raw aluminium frames', qty: 200, unitCost: 65 }] } },
  });
  await prisma.purchaseOrder.create({
    data: { number: 'PO-2000', partnerId: primeParts.id, status: 'received', amountTotal: 6000,
      lines: { create: [{ desc: 'LED lamp components', qty: 500, unitCost: 12 }] } },
  });
  await prisma.purchaseOrder.create({
    data: { number: 'PO-2002', partnerId: globalLogistics.id, status: 'draft', amountTotal: 8500,
      lines: { create: [{ desc: 'Shipping containers', qty: 10, unitCost: 850 }] } },
  });

  // --- Invoices & Payments ---
  const inv1 = await prisma.invoice.create({ data: { number: 'INV-3091', partnerId: aria.id, salesOrderId: so1.id, amount: 10960, status: 'unpaid', dueDate: new Date('2026-09-15') } });
  const inv2 = await prisma.invoice.create({ data: { number: 'INV-3090', partnerId: bluepeak.id, salesOrderId: so3.id, amount: 4080, status: 'paid', dueDate: new Date('2026-08-20') } });
  await prisma.payment.create({ data: { invoiceId: inv2.id, amount: 4080, method: 'bank' } });
  await prisma.invoice.create({ data: { number: 'INV-3089', partnerId: solace.id, amount: 7800, status: 'paid', dueDate: new Date('2026-08-10') } });
  await prisma.invoice.create({ data: { number: 'INV-3088', partnerId: kestrel.id, amount: 4300, status: 'overdue', dueDate: new Date('2026-08-01') } });
  await prisma.invoice.create({ data: { number: 'BILL-001', type: 'in_invoice', partnerId: acmeSupply.id, amount: 13000, status: 'unpaid', dueDate: new Date('2026-09-20') } });

  // --- Departments & Employees ---
  const salesDept = await prisma.department.create({ data: { name: 'Sales' } });
  const ops = await prisma.department.create({ data: { name: 'Operations' } });
  const peopleDept = await prisma.department.create({ data: { name: 'People & Culture' } });
  const finance = await prisma.department.create({ data: { name: 'Finance' } });
  const engineering = await prisma.department.create({ data: { name: 'Engineering' } });

  const empJasper = await prisma.employee.create({ data: { name: 'Jasper Solari', role: 'Sales Lead', departmentId: salesDept.id, email: 'jasper@ntos.dev', userId: jasper.id } });
  const empMika = await prisma.employee.create({ data: { name: 'Mika Kessler', role: 'Account Executive', departmentId: salesDept.id, email: 'mika@ntos.dev', userId: mika.id } });
  const empRenata = await prisma.employee.create({ data: { name: 'Renata Voss', role: 'Operations Manager', departmentId: ops.id, status: 'leave', email: 'renata@ntos.dev', userId: renataUser.id } });
  await prisma.employee.create({ data: { name: 'Tomas Reyes', role: 'Support Engineer', departmentId: ops.id, email: 'tomas@ntos.dev' } });
  await prisma.employee.create({ data: { name: 'Ines Aldana', role: 'HR Partner', departmentId: peopleDept.id, email: 'ines@ntos.dev' } });
  await prisma.employee.create({ data: { name: 'Ola Brandt', role: 'Finance Analyst', departmentId: finance.id, email: 'ola@ntos.dev' } });
  await prisma.employee.create({ data: { name: 'Liam Chen', role: 'Senior Developer', departmentId: engineering.id, email: 'liam@ntos.dev' } });
  await prisma.employee.create({ data: { name: 'Sofia Mendez', role: 'UX Designer', departmentId: engineering.id, email: 'sofia@ntos.dev' } });

  await prisma.leaveRequest.create({ data: { employeeId: empRenata.id, type: 'annual', startDate: new Date('2026-08-25'), endDate: new Date('2026-09-02'), status: 'approved' } });
  await prisma.leaveRequest.create({ data: { employeeId: empJasper.id, type: 'sick', startDate: new Date('2026-09-05'), endDate: new Date('2026-09-06'), status: 'pending' } });

  // --- Projects & Tasks ---
  const proj1 = await prisma.project.create({ data: { name: 'Aria Fintech Onboarding', partnerId: aria.id, status: 'active', deadline: new Date('2026-09-30') } });
  const proj2 = await prisma.project.create({ data: { name: 'Internal — Q3 Ops Review', status: 'active' } });
  const proj3 = await prisma.project.create({ data: { name: 'Website Redesign v2', partnerId: verve.id, status: 'active', deadline: new Date('2026-10-15') } });

  await prisma.task.createMany({
    data: [
      { projectId: proj1.id, title: 'Kickoff call & requirements', status: 'done', assigneeId: jasper.id, priority: 'high' },
      { projectId: proj1.id, title: 'Provision workspace + accounts', status: 'inprogress', assigneeId: mika.id, priority: 'high' },
      { projectId: proj1.id, title: 'Data migration checklist', status: 'todo', assigneeId: admin.id, priority: 'normal' },
      { projectId: proj1.id, title: 'User training sessions', status: 'todo', assigneeId: jasper.id, priority: 'normal' },
      { projectId: proj2.id, title: 'Draft Q3 proposal deck', status: 'todo', priority: 'normal' },
      { projectId: proj2.id, title: 'Vendor contract review', status: 'todo', priority: 'low' },
      { projectId: proj2.id, title: 'Q2 revenue report', status: 'done', priority: 'normal' },
      { projectId: proj3.id, title: 'Wireframe homepage', status: 'done', assigneeId: mika.id, priority: 'high' },
      { projectId: proj3.id, title: 'Design system components', status: 'inprogress', assigneeId: admin.id, priority: 'high' },
      { projectId: proj3.id, title: 'Implement responsive layout', status: 'todo', priority: 'normal' },
    ],
  });

  const t1 = await prisma.task.findFirst({ where: { title: 'Kickoff call & requirements' } });
  const t2 = await prisma.task.findFirst({ where: { title: 'Wireframe homepage' } });
  await prisma.timesheet.createMany({
    data: [
      { taskId: t1.id, userId: jasper.id, hours: 2.5, note: 'Client kickoff + notes' },
      { taskId: t1.id, userId: admin.id, hours: 1.0, note: 'Requirements review' },
      { taskId: t2.id, userId: mika.id, hours: 4.0, note: 'Homepage wireframes in Figma' },
    ],
  });

  // --- Helpdesk Tickets ---
  await prisma.helpdeskTicket.createMany({
    data: [
      { subject: 'Login issues after password reset', partnerId: kestrel.id, status: 'open', priority: 'high', assigneeId: admin.id, description: 'User cannot log in after resetting password via email link.' },
      { subject: 'Invoice discrepancy on INV-3088', partnerId: kestrel.id, status: 'pending', priority: 'normal', assigneeId: mika.id, description: 'Amount on invoice does not match PO total.' },
      { subject: 'Feature request: bulk export to CSV', partnerId: bluepeak.id, status: 'open', priority: 'low', assigneeId: jasper.id, description: 'Requesting ability to bulk export records as CSV.' },
      { subject: 'API rate limiting errors', partnerId: techVista.id, status: 'open', priority: 'urgent', assigneeId: admin.id, description: 'Getting 429 errors when syncing data.' },
      { subject: 'Shipping label printing issue', partnerId: northwind.id, status: 'resolved', priority: 'normal', assigneeId: mika.id, description: 'Labels printing with wrong dimensions.' },
    ],
  });

  // --- Calendar Events ---
  await prisma.calendarEvent.createMany({
    data: [
      { title: 'Aria Fintech — Kickoff Call', start: new Date('2026-09-01T10:00:00'), end: new Date('2026-09-01T11:00:00'), partnerId: aria.id },
      { title: 'Daily Team Standup', start: new Date('2026-09-01T09:00:00'), end: new Date('2026-09-01T09:15:00'), allDay: false },
      { title: 'Bluepeak Renewal Review', start: new Date('2026-09-04T14:00:00'), end: new Date('2026-09-04T15:00:00'), partnerId: bluepeak.id },
      { title: 'Q3 Board Meeting', start: new Date('2026-09-08T10:00:00'), end: new Date('2026-09-08T12:00:00'), allDay: false },
      { title: 'Team Building Event', start: new Date('2026-09-12T00:00:00'), end: new Date('2026-09-12T23:59:00'), allDay: true },
    ],
  });

  // --- Knowledge Articles ---
  await prisma.knowledgeArticle.createMany({
    data: [
      { title: 'New Employee Onboarding Checklist', category: 'HR', content: '# Onboarding Checklist\n\n1. **Day 1**: Welcome meeting, workspace setup, IT credentials\n2. **Week 1**: Department introductions, read company handbook\n3. **Week 2**: Shadow team members, begin first project\n4. **Month 1**: 30-day review with manager', authorId: admin.id },
      { title: 'Refund & Returns Policy', category: 'Sales', content: '# Refund Policy\n\nRefunds are processed within 5-7 business days for:\n- Unused subscription periods\n- Defective products within 30 days\n- Service cancellations with 48hr notice\n\n**No refunds** for custom orders or completed consulting.', authorId: admin.id },
      { title: 'Sales Playbook Q3 2026', category: 'Sales', content: '# Q3 Sales Playbook\n\n## Target Segments\n- Mid-market SaaS (50-500 employees)\n- Enterprise fintech\n- Healthcare logistics\n\n## Key Messaging\nFocus on ROI, integration speed, and total cost of ownership.', authorId: jasper.id },
      { title: 'IT Security Guidelines', category: 'IT', content: '# Security Best Practices\n\n- Use MFA on all accounts\n- Password minimum 12 characters\n- VPN required for remote access\n- Report suspicious emails to security@ntos.dev', authorId: admin.id },
    ],
  });

  // --- Manufacturing (MRP) ---
  const bom1 = await prisma.billOfMaterial.create({
    data: {
      code: 'BOM-DESK-001', productId: desk.id, qty: 1, routing: 'Standard Assembly Line',
      components: { create: [
        { productId: tray.id, qtyRequired: 1 },
        { productId: lamp.id, qtyRequired: 1 },
      ]},
    },
  });
  await prisma.manufacturingOrder.createMany({
    data: [
      { number: 'MO-001', bomId: bom1.id, qty: 50, status: 'confirmed', scheduledAt: new Date('2026-09-05') },
      { number: 'MO-002', bomId: bom1.id, qty: 25, status: 'in_progress', scheduledAt: new Date('2026-09-02') },
      { number: 'MO-003', bomId: bom1.id, qty: 100, status: 'draft', scheduledAt: new Date('2026-09-15') },
    ],
  });

  // --- Point of Sale ---
  const posSession = await prisma.posSession.create({
    data: { name: 'Main Register', openedBy: admin.id, status: 'opened' },
  });
  await prisma.posOrder.create({
    data: {
      number: 'POS-0001', sessionId: posSession.id, partnerId: aria.id, amountTotal: 549, paymentMode: 'card',
      lines: { create: [{ productId: monitor.id, qty: 1, unitPrice: 549 }] },
    },
  });
  await prisma.posOrder.create({
    data: {
      number: 'POS-0002', sessionId: posSession.id, amountTotal: 403, paymentMode: 'cash',
      lines: { create: [
        { productId: lamp.id, qty: 2, unitPrice: 64 },
        { productId: headset.id, qty: 1, unitPrice: 129 },
        { productId: tray.id, qty: 2, unitPrice: 39 },
        { productId: consulting.id, qty: 0.5, unitPrice: 150 },
      ]},
    },
  });

  // --- Subscriptions ---
  const planBasic = await prisma.subscriptionPlan.create({
    data: { name: 'Basic Support', code: 'PLAN-BASIC', billingPeriod: 'monthly', price: 99, productId: support.id },
  });
  const planPro = await prisma.subscriptionPlan.create({
    data: { name: 'Pro Suite', code: 'PLAN-PRO', billingPeriod: 'monthly', price: 299, productId: support.id },
  });
  const planEnterprise = await prisma.subscriptionPlan.create({
    data: { name: 'Enterprise', code: 'PLAN-ENT', billingPeriod: 'yearly', price: 2999, productId: support.id },
  });
  await prisma.subscription.createMany({
    data: [
      { code: 'SUB-001', partnerId: aria.id, planId: planPro.id, mrr: 299, status: 'active', nextBill: new Date('2026-10-01') },
      { code: 'SUB-002', partnerId: bluepeak.id, planId: planBasic.id, mrr: 99, status: 'active', nextBill: new Date('2026-09-15') },
      { code: 'SUB-003', partnerId: solace.id, planId: planEnterprise.id, mrr: 249.92, status: 'active', nextBill: new Date('2027-01-01') },
      { code: 'SUB-004', partnerId: kestrel.id, planId: planBasic.id, mrr: 99, status: 'paused', nextBill: new Date('2026-09-01') },
      { code: 'SUB-005', partnerId: techVista.id, planId: planPro.id, mrr: 299, status: 'active', nextBill: new Date('2026-10-01') },
    ],
  });

  // --- Discuss / Chat ---
  const general = await prisma.chatChannel.create({ data: { name: 'general', type: 'public', description: 'Company-wide announcements and discussion' } });
  const salesChannel = await prisma.chatChannel.create({ data: { name: 'sales-team', type: 'private', description: 'Sales team coordination' } });
  const random = await prisma.chatChannel.create({ data: { name: 'random', type: 'public', description: 'Off-topic and fun' } });

  await prisma.chatMessage.createMany({
    data: [
      { channelId: general.id, userId: admin.id, content: 'Welcome to NT/OS Enterprise Suite! 🎉' },
      { channelId: general.id, userId: jasper.id, content: 'Excited to start the new quarter! Big pipeline ahead.' },
      { channelId: general.id, userId: mika.id, content: 'Just closed the Solace Studio retainer 🎯' },
      { channelId: salesChannel.id, userId: jasper.id, content: 'Northwind meeting went well, they want a proposal by Friday.' },
      { channelId: salesChannel.id, userId: mika.id, content: 'On it! Will draft the proposal today.' },
      { channelId: random.id, userId: renataUser.id, content: 'Anyone up for lunch at the new place downtown?' },
    ],
  });

  // --- Sign (e-Signature) ---
  await prisma.signatureRequest.createMany({
    data: [
      { title: 'Northwind Supply Agreement 2026', partnerId: northwind.id, requesterId: admin.id, status: 'pending' },
      { title: 'Solace Studio Service Contract', partnerId: solace.id, requesterId: jasper.id, status: 'signed', signature: 'Solace-Studio-Signed', signedAt: new Date('2026-08-20') },
      { title: 'TechVista NDA', partnerId: techVista.id, requesterId: admin.id, status: 'pending' },
      { title: 'Acme Supply Vendor Terms', partnerId: acmeSupply.id, requesterId: mika.id, status: 'rejected' },
    ],
  });

  // --- Field Service ---
  await prisma.fieldServiceOrder.createMany({
    data: [
      { number: 'FSO-001', title: 'Install desk frames at Aria HQ', partnerId: aria.id, technicianId: renataUser.id, priority: 'high', status: 'scheduled', location: '123 Innovation Blvd, Austin TX', scheduledFor: new Date('2026-09-05T09:00:00'), notes: 'Bring 40 desk frames + tools' },
      { number: 'FSO-002', title: 'Monitor calibration — Bluepeak', partnerId: bluepeak.id, technicianId: mika.id, priority: 'normal', status: 'new', location: '456 Analytics Dr, Denver CO' },
      { number: 'FSO-003', title: 'Network setup — Kestrel warehouse', partnerId: kestrel.id, technicianId: admin.id, priority: 'urgent', status: 'in_progress', location: '789 Logistics Ave, Chicago IL', scheduledFor: new Date('2026-09-01T14:00:00') },
      { number: 'FSO-004', title: 'Annual maintenance — Solace Studio', partnerId: solace.id, priority: 'low', status: 'completed', location: '101 Creative Way, Toronto ON', notes: 'All equipment inspected and serviced' },
    ],
  });

  // --- Planning Shifts ---
  await prisma.planningShift.createMany({
    data: [
      { title: 'Morning Support', role: 'Support Engineer', userEmail: 'tomas@ntos.dev', startTime: new Date('2026-09-01T08:00:00'), endTime: new Date('2026-09-01T16:00:00'), allocated: 8 },
      { title: 'Afternoon Sales', role: 'Sales Rep', userEmail: 'jasper@ntos.dev', startTime: new Date('2026-09-01T12:00:00'), endTime: new Date('2026-09-01T20:00:00'), allocated: 8 },
      { title: 'Field Service AM', role: 'Technician', userEmail: 'renata@ntos.dev', startTime: new Date('2026-09-02T07:00:00'), endTime: new Date('2026-09-02T15:00:00'), allocated: 8 },
      { title: 'Night Support', role: 'Support Engineer', userEmail: 'mika@ntos.dev', startTime: new Date('2026-09-01T20:00:00'), endTime: new Date('2026-09-02T04:00:00'), allocated: 8, status: 'draft' },
    ],
  });

  // --- Email Marketing Campaigns ---
  await prisma.emailCampaign.createMany({
    data: [
      { title: 'Q3 Product Launch', subject: 'Introducing our new 4K Monitor lineup', target: 'Customers', status: 'sent', sentCount: 1240, opened: 856, clicked: 342, body: '<h1>New 4K Ultra Monitor</h1><p>Experience stunning visuals...</p>' },
      { title: 'Back-to-Office Sale', subject: '20% off all furniture this week', target: 'Customers', status: 'sent', sentCount: 980, opened: 567, clicked: 189 },
      { title: 'Partner Newsletter Sept', subject: 'Monthly partner updates — September 2026', target: 'Vendors', status: 'draft', sentCount: 0, opened: 0, clicked: 0, body: '<h1>Partner Updates</h1><p>Exciting news this month...</p>' },
      { title: 'Renewal Reminder', subject: 'Your subscription is expiring soon', target: 'Customers', status: 'queued', sentCount: 0 },
    ],
  });

  // --- Studio Custom Fields ---
  await prisma.studioCustomField.createMany({
    data: [
      { modelName: 'Partner', fieldName: 'x_industry', fieldType: 'char', label: 'Industry' },
      { modelName: 'Partner', fieldName: 'x_revenue_tier', fieldType: 'selection', label: 'Revenue Tier', required: false },
      { modelName: 'Lead', fieldName: 'x_competitor', fieldType: 'char', label: 'Main Competitor' },
      { modelName: 'SalesOrder', fieldName: 'x_shipping_method', fieldType: 'selection', label: 'Shipping Method' },
    ],
  });

  // --- Record Activities (Chatter) ---
  await prisma.recordActivity.createMany({
    data: [
      { resModel: 'Lead', resId: 1, type: 'note', summary: 'Initial contact made via LinkedIn, very interested in our enterprise plan.', userId: jasper.id },
      { resModel: 'Lead', resId: 2, type: 'email', summary: 'Sent pricing proposal for annual contract.', userId: mika.id },
      { resModel: 'SalesOrder', resId: 1, type: 'note', summary: 'Customer confirmed order quantities. Ready for shipment.', userId: admin.id },
      { resModel: 'Invoice', resId: 1, type: 'email', summary: 'Payment reminder sent to accounts@ariafintech.com', userId: admin.id },
      { resModel: 'Project', resId: 1, type: 'meeting', summary: 'Kickoff meeting completed. All stakeholders aligned on timeline.', userId: jasper.id },
    ],
  });

  // --- Notifications ---
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, text: '🔴 Invoice INV-3088 is now overdue — ₹4,300 outstanding' },
      { userId: admin.id, text: '📦 Carbon Task Chair stock is below reorder point (18/25)' },
      { userId: admin.id, text: '🎯 Bluepeak Renewal moved to Proposal stage' },
      { userId: admin.id, text: '🏭 Manufacturing Order MO-002 is in progress' },
      { userId: jasper.id, text: '📋 New helpdesk ticket assigned: API rate limiting errors' },
      { userId: mika.id, text: '✅ Solace Studio contract has been signed' },
    ],
  });

  console.log('✅ Seed complete — Full Enterprise Suite loaded.');
  console.log('Login with: admin@ntos.dev / demo1234');
  console.log('Or: jasper@ntos.dev / demo1234');
  console.log('Or: mika@ntos.dev / demo1234');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
