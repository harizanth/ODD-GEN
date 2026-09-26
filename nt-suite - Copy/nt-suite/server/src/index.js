import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import authRoutes from './routes/auth.js';
import contactsRoutes from './routes/contacts.js';
import crmRoutes from './routes/crm.js';
import salesRoutes from './routes/sales.js';
import purchaseRoutes from './routes/purchase.js';
import invoicingRoutes from './routes/invoicing.js';
import inventoryRoutes from './routes/inventory.js';
import projectsRoutes from './routes/projects.js';
import timesheetsRoutes from './routes/timesheets.js';
import hrRoutes from './routes/hr.js';
import helpdeskRoutes from './routes/helpdesk.js';
import calendarRoutes from './routes/calendar.js';
import knowledgeRoutes from './routes/knowledge.js';
import documentsRoutes from './routes/documents.js';
import dashboardRoutes from './routes/dashboard.js';
import notificationsRoutes from './routes/notifications.js';
import searchRoutes from './routes/search.js';
import posRoutes from './routes/pos.js';
import mrpRoutes from './routes/mrp.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import discussRoutes from './routes/discuss.js';
import signRoutes from './routes/sign.js';
import fieldserviceRoutes from './routes/fieldservice.js';
import marketingRoutes from './routes/marketing.js';
import studioRoutes from './routes/studio.js';
import aiRoutes from './routes/ai.js';
import spatialRoutes from './routes/spatial.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Public
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true, name: 'NT/OS Enterprise Suite API' }));

// Everything else requires a valid JWT
app.use('/api', requireAuth);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/invoicing', invoicingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/timesheets', timesheetsRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/mrp', mrpRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/discuss', discussRoutes);
app.use('/api/sign', signRoutes);
app.use('/api/fieldservice', fieldserviceRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/studio', studioRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/spatial', spatialRoutes);

// Serve built frontend in production
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`NT/OS API running on http://127.0.0.1:${PORT}`));
