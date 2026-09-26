import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Monitor, Building2, Store, Factory, Scale, Zap, Heart, Palette,
} from 'lucide-react';

// Map icon name strings → Lucide components
const BUSINESS_ICON_MAP = {
  Monitor,
  Building2,
  Store,
  Factory,
  Scale,
  Zap,
  Heart,
  Palette,
};

/**
 * Returns the Lucide React component for a business profile icon name.
 * Usage: const Icon = getBusinessIcon(profile.iconName); <Icon size={20} />
 */
export function getBusinessIcon(iconName) {
  return BUSINESS_ICON_MAP[iconName] || Building2;
}

const BusinessContext = createContext(null);

export const BUSINESS_PROFILES = {
  it_company: {
    id: 'it_company',
    name: 'IT & Software Development Company',
    shortName: 'IT & Software',
    tagline: 'Agile sprints, cloud infrastructure, SaaS recurring revenue & DevOps.',
    iconName: 'Monitor',
    iconColor: '#714B67',
    iconBg: '#F5EEF3',
    themeColor: '#714B67',
    badge: 'TECH & SAAS',
    termCustomer: 'Client Accounts',
    termOrder: 'Software Contracts',
    termProject: 'Sprint Releases',
    featuredAppIds: ['projects', 'subscriptions', 'discuss', 'timesheets', 'spatial', 'ai', 'helpdesk', 'knowledge'],
    kpis: [
      { label: 'SaaS Monthly MRR', value: '₹18,45,000', change: '+14.8%', trend: 'up' },
      { label: 'Sprint Velocity', value: '88 Pts / Cycle', change: '+9.2%', trend: 'up' },
      { label: 'Cloud Uptime SLA', value: '99.98%', change: 'Normal', trend: 'up' },
      { label: 'Active Developer Capacity', value: '42 Engs', change: 'Full', trend: 'neutral' },
    ],
    spatialPreset: 'office',
    spatialRoomName: 'Level 4 Tech Hub & Server Bays',
  },
  private_org: {
    id: 'private_org',
    name: 'Private Organization & Corporate Enterprise',
    shortName: 'Corporate Enterprise',
    tagline: 'Multi-entity consolidation, procurement approvals, audit logs & executive BI.',
    iconName: 'Building2',
    iconColor: '#017E84',
    iconBg: '#E6F5F5',
    themeColor: '#017E84',
    badge: 'CORPORATE ENTITY',
    termCustomer: 'Corporate Partners',
    termOrder: 'Enterprise Purchase Orders',
    termProject: 'Strategic Roadmaps',
    featuredAppIds: ['accounting', 'purchase', 'crm', 'sign', 'documents', 'hr', 'planning', 'dashboard'],
    kpis: [
      { label: 'Quarterly Operating Revenue', value: '₹4.82 Cr', change: '+22.4%', trend: 'up' },
      { label: 'Procurement Spend Variance', value: '-6.2%', change: 'Optimal', trend: 'up' },
      { label: 'Statutory Audit Readiness', value: '100%', change: 'Compliant', trend: 'up' },
      { label: 'Headcount Across Entities', value: '280 Staff', change: '+12 hires', trend: 'up' },
    ],
    spatialPreset: 'office',
    spatialRoomName: 'Executive Tower 1 - Main Floor',
  },
  small_business: {
    id: 'small_business',
    name: 'Small Business & Retail Store',
    shortName: 'Small Business & Retail',
    tagline: 'Touchscreen cashier POS, barcode inventory, quick invoicing & loyalty.',
    iconName: 'Store',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    themeColor: '#FFB703',
    badge: 'RETAIL & SHOP',
    termCustomer: 'Walk-in Customers',
    termOrder: 'Store Sales Receipts',
    termProject: 'Store Fit-out Tasks',
    featuredAppIds: ['pos', 'inventory', 'accounting', 'sales', 'ecommerce', 'marketing', 'contacts', 'discuss'],
    kpis: [
      { label: 'Daily Retail Footfall', value: '640 Visitors', change: '+18.5%', trend: 'up' },
      { label: 'Cash & Card POS Register', value: '₹1,24,500', change: '+11.2%', trend: 'up' },
      { label: 'Fast-Moving Stock SKU', value: '42 Items Low', change: 'Action', trend: 'down' },
      { label: 'Loyalty Club Conversion', value: '44%', change: '+5.0%', trend: 'up' },
    ],
    spatialPreset: 'living',
    spatialRoomName: 'High Street Retail Showroom',
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial Plant',
    shortName: 'Industrial Manufacturing',
    tagline: 'Bills of Materials (BOM), shop-floor work orders, raw materials & equipment.',
    iconName: 'Factory',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    themeColor: '#00BAF2',
    badge: 'INDUSTRIAL PLANT',
    termCustomer: 'Distributors & Wholesalers',
    termOrder: 'Manufacturing Production Orders',
    termProject: 'Assembly Line Upgrades',
    featuredAppIds: ['mrp', 'inventory', 'purchase', 'fieldservice', 'planning', 'accounting', 'spatial', 'documents'],
    kpis: [
      { label: 'Overall Equipment OEE', value: '89.4%', change: '+3.1%', trend: 'up' },
      { label: 'Assembly Line Yield', value: '98.2%', change: '+0.8%', trend: 'up' },
      { label: 'Raw Steel & Part Stock', value: '4,200 Units', change: 'Supplied', trend: 'neutral' },
      { label: 'Active Work Center Hours', value: '320 Hrs / Wk', change: 'Optimal', trend: 'up' },
    ],
    spatialPreset: 'warehouse',
    spatialRoomName: 'Industrial Work Center Floor #2',
  },
  consulting: {
    id: 'consulting',
    name: 'Consulting & Professional Services Firm',
    shortName: 'Consulting & Advisory',
    tagline: 'Client retainer billing, employee timesheets, contracts e-sign & milestones.',
    iconName: 'Scale',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    themeColor: '#9D4EDD',
    badge: 'PROFESSIONAL SERVICES',
    termCustomer: 'Advisory Clients',
    termOrder: 'Service Engagement Letters',
    termProject: 'Client Engagements',
    featuredAppIds: ['timesheets', 'sign', 'projects', 'accounting', 'calendar', 'knowledge', 'helpdesk', 'hr'],
    kpis: [
      { label: 'Billable Utilization Rate', value: '86.5%', change: '+4.2%', trend: 'up' },
      { label: 'Active Retainer Revenue', value: '₹14,80,000', change: '+8.0%', trend: 'up' },
      { label: 'Executed SOW Contracts', value: '28 Signed', change: '+6 this mo', trend: 'up' },
      { label: 'Average Realized Hourly Rate', value: '₹6,500/hr', change: '+5.5%', trend: 'up' },
    ],
    spatialPreset: 'conference',
    spatialRoomName: 'Partner Boardroom & Advisory Suite',
  },
  fieldservice: {
    id: 'fieldservice',
    name: 'Field Service & Facility Maintenance',
    shortName: 'Field Service & Repair',
    tagline: 'Technician GPS dispatch, IoT condition monitoring, onsite work orders & parts.',
    iconName: 'Zap',
    iconColor: '#EA580C',
    iconBg: '#FFF7ED',
    themeColor: '#E67E22',
    badge: 'ONSITE DISPATCH',
    termCustomer: 'Facility Accounts',
    termOrder: 'Work Order Tickets',
    termProject: 'Turnkey Installations',
    featuredAppIds: ['fieldservice', 'planning', 'inventory', 'spatial', 'helpdesk', 'timesheets', 'accounting', 'crm'],
    kpis: [
      { label: 'First-Time Fix Rate', value: '92.1%', change: '+3.5%', trend: 'up' },
      { label: 'Active Dispatched Techs', value: '18 Onsite', change: 'Live', trend: 'neutral' },
      { label: 'Average Response Time', value: '44 Minutes', change: '-12m', trend: 'up' },
      { label: 'Replacement Parts Stock', value: '98% Ready', change: 'In Stock', trend: 'up' },
    ],
    spatialPreset: 'warehouse',
    spatialRoomName: 'Central Logistics & Tool Depot',
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Specialized Clinic Facility',
    shortName: 'Healthcare & Clinic',
    tagline: 'Practitioner appointments, patient history vault, medical inventory & billing.',
    iconName: 'Heart',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    themeColor: '#10B981',
    badge: 'HEALTHCARE & MEDICAL',
    termCustomer: 'Registered Patients',
    termOrder: 'Treatment Consultation Invoices',
    termProject: 'Clinical Protocol Reviews',
    featuredAppIds: ['calendar', 'documents', 'inventory', 'accounting', 'planning', 'helpdesk', 'sign', 'knowledge'],
    kpis: [
      { label: 'Daily Consultations', value: '124 Patients', change: '+14%', trend: 'up' },
      { label: 'Doctor Roster Utilization', value: '91%', change: 'Optimal', trend: 'up' },
      { label: 'Pharma Inventory Reorder', value: '12 Items Safe', change: 'Good', trend: 'up' },
      { label: 'Patient Satisfaction CSAT', value: '4.9 / 5.0', change: '+0.2', trend: 'up' },
    ],
    spatialPreset: 'conference',
    spatialRoomName: 'Consultation & Diagnostics Suite',
  },
  creative: {
    id: 'creative',
    name: 'Creative Agency & Media Studio',
    shortName: 'Creative & Digital Agency',
    tagline: 'Multi-channel marketing campaigns, design sprint tasks, digital asset vault & proposals.',
    iconName: 'Palette',
    iconColor: '#E11D48',
    iconBg: '#FFF1F2',
    themeColor: '#FF6584',
    badge: 'CREATIVE & MEDIA',
    termCustomer: 'Brand Partners',
    termOrder: 'Media Campaign Retainers',
    termProject: 'Production Sprints',
    featuredAppIds: ['marketing', 'projects', 'ecommerce', 'documents', 'discuss', 'sales', 'timesheets', 'sign'],
    kpis: [
      { label: 'Live Campaign Impressions', value: '2.8M Reach', change: '+34%', trend: 'up' },
      { label: 'Creative Delivery On-Time', value: '97.4%', change: '+2.1%', trend: 'up' },
      { label: 'Media Asset Storage Used', value: '1.4 TB', change: 'Active', trend: 'neutral' },
      { label: 'Client Pitch Win Rate', value: '68%', change: '+12%', trend: 'up' },
    ],
    spatialPreset: 'living',
    spatialRoomName: 'Design Lounge & Collaboration Pods',
  },
};

export function BusinessProvider({ children }) {
  const [activeBusinessId, setActiveBusinessId] = useState(
    localStorage.getItem('ntos_business_type') || 'it_company'
  );

  const activeBusiness = BUSINESS_PROFILES[activeBusinessId] || BUSINESS_PROFILES.it_company;

  const setBusiness = (businessId) => {
    if (BUSINESS_PROFILES[businessId]) {
      setActiveBusinessId(businessId);
      localStorage.setItem('ntos_business_type', businessId);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        activeBusinessId,
        activeBusiness,
        setBusiness,
        allBusinesses: Object.values(BUSINESS_PROFILES),
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return ctx;
}
