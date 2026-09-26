import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { BusinessProvider } from './context/BusinessContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Landing from './pages/Landing.jsx';
import BusinessPlanner from './pages/BusinessPlanner.jsx';
import HomeAppsGrid from './pages/HomeAppsGrid.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Contacts from './pages/Contacts.jsx';
import CRM from './pages/CRM.jsx';
import Sales from './pages/Sales.jsx';
import Purchase from './pages/Purchase.jsx';
import Invoicing from './pages/Invoicing.jsx';
import Inventory from './pages/Inventory.jsx';
import MRP from './pages/MRP.jsx';
import POS from './pages/POS.jsx';
import Subscriptions from './pages/Subscriptions.jsx';
import Projects from './pages/Projects.jsx';
import Timesheets from './pages/Timesheets.jsx';
import HR from './pages/HR.jsx';
import Helpdesk from './pages/Helpdesk.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import Knowledge from './pages/Knowledge.jsx';
import Documents from './pages/Documents.jsx';
import Discuss from './pages/Discuss.jsx';
import Sign from './pages/Sign.jsx';
import FieldService from './pages/FieldService.jsx';
import Planning from './pages/Planning.jsx';
import Marketing from './pages/Marketing.jsx';
import ECommerce from './pages/ECommerce.jsx';
import Studio from './pages/Studio.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import SpatialAI from './pages/SpatialAI.jsx';
import Settings from './pages/Settings.jsx';

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/landing" replace />;
  return children;
}

export default function App() {
  const { ready } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('ntos_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  if (!ready) return null;

  return (
    <BusinessProvider>
      <Routes>
        {/* 1st Interface: Authentic Landing Page */}
        <Route path="/landing" element={<Landing />} />

        {/* 2nd Interface: 'What are you planning?' Business Selector */}
        <Route path="/start-business" element={<BusinessPlanner />} />

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* 3rd Interface: The 26 Enterprise Modules */}
        <Route
          path="/"
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route index element={<HomeAppsGrid />} />
          <Route path="spatial-ai" element={<SpatialAI />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crm" element={<CRM />} />
          <Route path="sales" element={<Sales />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="invoicing" element={<Invoicing />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="mrp" element={<MRP />} />
          <Route path="pos" element={<POS />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="projects" element={<Projects />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="hr" element={<HR />} />
          <Route path="helpdesk" element={<Helpdesk />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="documents" element={<Documents />} />
          <Route path="discuss" element={<Discuss />} />
          <Route path="sign" element={<Sign />} />
          <Route path="fieldservice" element={<FieldService />} />
          <Route path="planning" element={<Planning />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="ecommerce" element={<ECommerce />} />
          <Route path="studio" element={<Studio />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BusinessProvider>
  );
}
