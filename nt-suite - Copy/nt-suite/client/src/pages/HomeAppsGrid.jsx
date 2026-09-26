import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness, getBusinessIcon } from '../context/BusinessContext.jsx';
import {
  getOdooAppIcon,
  DoodleTarget,
  DoodleDocument,
  DoodleSliders,
  DoodleBucket,
} from '../components/OdooAppIcons.jsx';
import {
  Search,
  ArrowRight,
  X,
  Save,
  Sun,
  Moon,
  Building2,
  Globe,
  Sparkles,
  LayoutGrid,
  CreditCard,
  Layers,
  Briefcase,
  Radio,
  MessageSquare,
  Megaphone,
  Cpu,
  DollarSign,
} from 'lucide-react';

/* ================================================================
   ONBOARDING DOODLE SETUP STEPS (from user reference media_1788604168111.png)
   Hand-drawn doodle icons with offset color fill + cursive handwriting
   ================================================================ */
const ONBOARDING_DOODLES = [
  {
    id: 'step_business',
    actionWord: 'Set',
    label: 'your business',
    DoodleIcon: DoodleTarget,
  },
  {
    id: 'step_logo',
    actionWord: 'Add',
    label: 'your logo',
    DoodleIcon: DoodleDocument,
  },
  {
    id: 'step_features',
    actionWord: 'Select',
    label: 'additional features',
    DoodleIcon: DoodleSliders,
  },
  {
    id: 'step_theme',
    actionWord: 'Choose',
    label: 'your favorite theme',
    DoodleIcon: DoodleBucket,
  },
];

/* ================================================================
   ALL 27 APPS — ORGANIZED BY ENTERPRISE ERP CATEGORIES
   ================================================================ */
const APPS = [
  // 1. Finance & Revenue
  { id: 'accounting', name: 'Accounting', title: 'Manage', subtitle: 'invoices & finance', path: '/invoicing', desc: 'Customer invoices, vendor bills & bank balance', category: 'finance' },
  { id: 'sales', name: 'Sales', title: 'Sell', subtitle: 'orders & quotes', path: '/sales', desc: 'Quotations, pricing tables & delivery sync', category: 'finance' },
  { id: 'purchase', name: 'Purchase', title: 'Source', subtitle: 'vendor procurement', path: '/purchase', desc: 'Purchase orders, RFQs & incoming inventory', category: 'finance' },
  { id: 'subscriptions', name: 'Subscriptions', title: 'Retain', subtitle: 'recurring revenue', path: '/subscriptions', desc: 'Subscriber plans, MRR churn & renewals', category: 'finance' },

  // 2. Supply Chain & Operations
  { id: 'inventory', name: 'Inventory', title: 'Track', subtitle: 'warehouse stock', path: '/inventory', desc: 'Real-time stock ledger & automated reordering', category: 'operations' },
  { id: 'mrp', name: 'Manufacturing', title: 'Build', subtitle: 'manufacturing BOMs', path: '/mrp', desc: 'Bills of materials (BOM) & work assembly orders', category: 'operations' },
  { id: 'pos', name: 'Point of Sale', title: 'Checkout', subtitle: 'cashier retail store', path: '/pos', desc: 'Touchscreen cashier, barcode scanner & receipts', category: 'operations' },
  { id: 'ecommerce', name: 'eCommerce', title: 'Shop', subtitle: 'online storefront', path: '/ecommerce', desc: 'Public catalog, shopping cart & instant checkout', category: 'operations' },

  // 3. Workforce & Productivity
  { id: 'projects', name: 'Project', title: 'Organize', subtitle: 'agile team sprints', path: '/projects', desc: 'Task kanban boards, deadlines & milestones', category: 'workforce' },
  { id: 'timesheets', name: 'Timesheets', title: 'Clock', subtitle: 'time & billing', path: '/timesheets', desc: 'Live stopwatch session timer & hour logs', category: 'workforce' },
  { id: 'planning', name: 'Planning', title: 'Schedule', subtitle: 'employee shifts', path: '/planning', desc: 'Shift rosters, roles & capacity balance', category: 'workforce' },
  { id: 'hr', name: 'Employees', title: 'Connect', subtitle: 'team roster', path: '/hr', desc: 'Org chart, team directory & leave approvals', category: 'workforce' },

  // 4. Field Service & Support
  { id: 'fieldservice', name: 'Field Service', title: 'Dispatch', subtitle: 'onsite work orders', path: '/fieldservice', desc: 'Mobile technician dispatch & location routing', category: 'service' },
  { id: 'helpdesk', name: 'Helpdesk', title: 'Support', subtitle: 'client tickets', path: '/helpdesk', desc: 'Ticket triage, customer SLAs & resolution ratings', category: 'service' },
  { id: 'sign', name: 'Sign', title: 'Sign', subtitle: 'contracts & PDFs', path: '/sign', desc: 'Electronic signatures & legal verification', category: 'service' },

  // 5. Communication & Workspace
  { id: 'discuss', name: 'Discuss', title: 'Chat', subtitle: 'team messages', path: '/discuss', desc: 'Direct messages & shared project channels', category: 'communication' },
  { id: 'documents', name: 'Documents', title: 'Store', subtitle: 'files & docs', path: '/documents', desc: 'Categorized cloud file storage & contracts', category: 'communication' },
  { id: 'knowledge', name: 'Knowledge', title: 'Learn', subtitle: 'company wiki', path: '/knowledge', desc: 'Collaborative internal playbooks & SOP guides', category: 'communication' },
  { id: 'calendar', name: 'Calendar', title: 'Plan', subtitle: 'events & calls', path: '/calendar', desc: 'Demo meetings, executive calls & board agenda', category: 'communication' },
  { id: 'contacts', name: 'Contacts', title: 'Meet', subtitle: 'partner directory', path: '/contacts', desc: 'Centralized 360-degree customer directory', category: 'communication' },

  // 6. Growth & Marketing
  { id: 'crm', name: 'CRM', title: 'Grow', subtitle: 'sales pipeline', path: '/crm', desc: 'Leads, qualified deals & revenue opportunities', category: 'marketing' },
  { id: 'marketing', name: 'Email Marketing', title: 'Blast', subtitle: 'email campaigns', path: '/marketing', desc: 'Audience newsletters & click conversion rates', category: 'marketing' },
  { id: 'website', name: 'Website', title: 'Publish', subtitle: 'corporate web presence', path: '/landing', desc: 'Public portal, customer landing & booking', category: 'marketing' },

  // 7. Intelligence & Studio
  { id: 'spatial', name: 'Spatial AI', title: 'Design', subtitle: 'spatial infrastructure', path: '/spatial-ai', desc: 'Generative physical design, auto BOM/PO & Digital Twin', category: 'intelligence' },
  { id: 'dashboard', name: 'Dashboard', title: 'Analyze', subtitle: 'executive metrics', path: '/dashboard', desc: 'Real-time telemetry, revenue forecast & KPIs', category: 'intelligence' },
  { id: 'studio', name: 'Studio', title: 'Customize', subtitle: 'no-code models', path: '/studio', desc: 'Dynamic database model & field customizer', category: 'intelligence' },
  { id: 'ai', name: 'AI', title: 'Ask', subtitle: 'AI intelligence', path: '/ai', desc: 'Business intelligence AI data recommendations', category: 'intelligence' },
];

/* ================================================================
   CATEGORY DEFINITIONS WITH METADATA & ACCENTS
   ================================================================ */
const CATEGORIES = [
  { key: 'all', title: 'All Modules', icon: LayoutGrid, count: 27 },
  {
    key: 'finance',
    title: 'Finance & Revenue',
    subtitle: 'Customer invoicing, sales quotations, procurement & subscription MRR',
    icon: DollarSign,
    color: '#017E84',
    bg: '#E6F5F5',
    count: 4,
  },
  {
    key: 'operations',
    title: 'Supply Chain & Operations',
    subtitle: 'Warehouse inventory, manufacturing BOMs, touchscreen POS & eCommerce',
    icon: Layers,
    color: '#2563EB',
    bg: '#EFF6FF',
    count: 4,
  },
  {
    key: 'workforce',
    title: 'Workforce & Productivity',
    subtitle: 'Agile sprints, timesheets stopwatch, shift planning & employee directory',
    icon: Briefcase,
    color: '#4338CA',
    bg: '#EEF2FF',
    count: 4,
  },
  {
    key: 'service',
    title: 'Field Service & Support',
    subtitle: 'Mobile technician dispatch, customer support SLA tickets & e-signatures',
    icon: Radio,
    color: '#EA580C',
    bg: '#FFF7ED',
    count: 3,
  },
  {
    key: 'communication',
    title: 'Communication & Knowledge',
    subtitle: 'Live team chat, cloud documents, SOP playbooks, calendar & contacts hub',
    icon: MessageSquare,
    color: '#0D9488',
    bg: '#F0FDFA',
    count: 5,
  },
  {
    key: 'marketing',
    title: 'Growth & Marketing',
    subtitle: 'CRM opportunity deals, email newsletters & corporate web presence',
    icon: Megaphone,
    color: '#E11D48',
    bg: '#FFF1F2',
    count: 3,
  },
  {
    key: 'intelligence',
    title: 'Intelligence & Studio',
    subtitle: 'Spatial AI digital twin, executive BI analytics, database studio & AI copilot',
    icon: Cpu,
    color: '#714B67',
    bg: '#F5EEF3',
    count: 4,
  },
];

/* ================================================================
   MAIN HOME APPS GRID COMPONENT
   ================================================================ */
export default function HomeAppsGrid() {
  const navigate = useNavigate();
  const { activeBusiness } = useBusiness();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('icons'); // 'icons' (Odoo launcher) | 'cards' (Executive workflow deck)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModal, setActiveModal] = useState(null);

  // Onboarding Wizard State
  const [companyName, setCompanyName] = useState('ODD GEN Technologies Ltd.');
  const [currency, setCurrency] = useState('INR (₹)');
  const [taxId, setTaxId] = useState('GSTIN29ABCDE1234F1Z5');
  const [themeMode, setThemeMode] = useState(localStorage.getItem('ntos_theme') || 'light');
  const [accentColor, setAccentColor] = useState('#714B67');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleStepClick = (stepId) => {
    if (stepId === 'step_business') setActiveModal('business');
    if (stepId === 'step_logo') setActiveModal('logo');
    if (stepId === 'step_features') setActiveModal('features');
    if (stepId === 'step_theme') setActiveModal('theme');
  };

  const handleSaveSettings = () => {
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      setActiveModal(null);
    }, 900);
  };

  const toggleTheme = (theme) => {
    setThemeMode(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ntos_theme', theme);
  };

  // Determine which category sections are visible
  const visibleCategories =
    selectedCategory === 'all'
      ? CATEGORIES.filter((c) => c.key !== 'all')
      : CATEGORIES.filter((c) => c.key === selectedCategory);

  // Helper to get matching apps for a category
  const getCategoryApps = (catKey) => {
    return APPS.filter((app) => {
      const matchCat = app.category === catKey;
      const matchSearch =
        !search.trim() ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.title.toLowerCase().includes(search.toLowerCase()) ||
        app.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        app.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  };

  const BusinessIcon = getBusinessIcon(activeBusiness?.iconName);

  return (
    <div className="min-h-full pb-28 px-4 max-w-7xl mx-auto pt-6" style={{ fontFamily: 'var(--font-body)' }}>

      {/* ─── TOP ANNOUNCEMENT PILL ─── */}
      <div className="flex justify-center mb-7">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-200/70 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:shadow-md transition-all">
          <span className="text-base leading-none">🇮🇳</span>
          <span className="font-semibold text-slate-900 dark:text-white">ODD GEN Enterprise Suite</span>
          <span className="text-slate-400">·</span>
          <span>Active: <strong className="text-[#714B67] dark:text-purple-400">{activeBusiness?.shortName || activeBusiness?.name}</strong></span>
          <span className="text-slate-400">·</span>
          <button
            onClick={() => navigate('/start-business')}
            className="text-[#714B67] dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
          >
            Switch Business Type →
          </button>
        </div>
      </div>

      {/* ─── 4 HAND-DRAWN DOODLE SETUP STEPS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
        {ONBOARDING_DOODLES.map((step) => {
          const Doodle = step.DoodleIcon;
          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className="doodle-step-card group"
              title={`Configure: ${step.actionWord} ${step.label}`}
            >
              <div className="mb-2.5 transition-transform duration-200 group-hover:scale-110">
                <Doodle size={48} />
              </div>
              <div className="font-handwriting text-2xl font-bold italic text-slate-900 dark:text-white leading-none mb-1">
                {step.actionWord}
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── ACTIVE BUSINESS PROFILE OVERVIEW BANNER ─── */}
      {activeBusiness && (
        <div className="business-banner mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4" style={{ borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3.5">
              <div
                className="banner-icon"
                style={{ backgroundColor: activeBusiness.iconBg, color: activeBusiness.iconColor }}
              >
                <BusinessIcon size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                    {activeBusiness.name}
                  </h2>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${activeBusiness.themeColor}18`, color: activeBusiness.themeColor }}
                  >
                    {activeBusiness.badge}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                  {activeBusiness.tagline} · <strong style={{ color: 'var(--odoo-teal)' }}>All 26 interconnected enterprise modules active</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/start-business')}
                className="o-btn flex items-center gap-1.5 text-xs font-semibold"
              >
                <Building2 size={13} />
                <span>Switch Business Type</span>
              </button>
              <button
                onClick={() => navigate('/landing')}
                className="o-btn flex items-center gap-1.5 text-xs"
                style={{ color: 'var(--ink-muted)' }}
              >
                <Globe size={13} />
                <span>Portal & Landing</span>
              </button>
            </div>
          </div>

          {/* Industry KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeBusiness.kpis?.map((kpi, idx) => (
              <div key={idx} className="business-kpi-card">
                <div className="business-kpi-label">{kpi.label}</div>
                <div className="business-kpi-value">{kpi.value}</div>
                <div className="business-kpi-change">{kpi.change}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── HERO & LAUNCHER TOOLBAR ─── */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight mb-2">
          Business Applications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-6">
          Launch and manage your enterprise modules, organized into clean operational departments
        </p>

        {/* Search Bar + View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          <div className="relative w-full sm:flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications (e.g. Accounting, CRM, Inventory, Sign)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67] dark:focus:ring-purple-400 shadow-sm transition"
            />
          </div>

          {/* View Switcher Button */}
          <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('icons')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'icons'
                  ? 'bg-white dark:bg-slate-700 text-[#714B67] dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Odoo App Grid</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-[#714B67] dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CreditCard size={13} />
              <span>Workflow Cards</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#714B67] text-white shadow-md ring-2 ring-[#714B67]/20 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 shadow-sm'
                }`}
              >
                <span>{cat.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── CATEGORIZED MODULE SECTIONS (Organized by Department) ─── */}
      <div className="space-y-8 max-w-6xl mx-auto">
        {visibleCategories.map((cat) => {
          const catApps = getCategoryApps(cat.key);
          if (catApps.length === 0) return null;
          const CatIcon = cat.icon;

          return (
            <div
              key={cat.key}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <CatIcon size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                        {cat.title}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {catApps.length} {catApps.length === 1 ? 'module' : 'modules'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* View 1: Odoo App Launcher Icons */}
              {viewMode === 'icons' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
                  {catApps.map((app) => {
                    const AppVectorIcon = getOdooAppIcon(app.id);
                    const isCore = activeBusiness?.featuredAppIds?.includes(app.id);

                    return (
                      <div
                        key={app.id}
                        onClick={() => navigate(app.path)}
                        className="flex flex-col items-center cursor-pointer group"
                        title={`${app.name}: ${app.desc}`}
                      >
                        {/* Squircle White Card */}
                        <div className="odoo-launcher-card w-20 h-20 sm:w-22 sm:h-22">
                          {/* Core Badge Indicator */}
                          {isCore && (
                            <span
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                              style={{ backgroundColor: activeBusiness?.themeColor || '#714B67' }}
                              title="Core app for active business"
                            >
                              ★
                            </span>
                          )}
                          {/* Multi-Color Vector SVG Artwork */}
                          <AppVectorIcon size={44} />
                        </div>

                        {/* App Label */}
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 text-center mt-2.5 tracking-tight group-hover:text-[#714B67] dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                          {app.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 text-center line-clamp-1 mt-0.5">
                          {app.subtitle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: Executive Workflow Cards */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catApps.map((app) => {
                    const AppVectorIcon = getOdooAppIcon(app.id);
                    const isCore = activeBusiness?.featuredAppIds?.includes(app.id);

                    return (
                      <div
                        key={app.id}
                        onClick={() => navigate(app.path)}
                        className="app-card group relative"
                      >
                        {/* Core App Badge */}
                        {isCore && (
                          <span
                            className="app-core-badge"
                            style={{
                              backgroundColor: `${activeBusiness?.themeColor || '#714B67'}14`,
                              color: activeBusiness?.themeColor || '#714B67',
                            }}
                          >
                            ★ CORE
                          </span>
                        )}

                        {/* App Vector Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <AppVectorIcon size={34} />
                        </div>

                        {/* Title & Subtitle */}
                        <div className="app-title">{app.title}</div>
                        <div className="app-subtitle">{app.subtitle}</div>

                        {/* Description */}
                        <p className="app-desc">{app.desc}</p>

                        {/* Launch Action */}
                        <div className="app-launch">
                          <span>Launch {app.name}</span>
                          <ArrowRight size={13} className="launch-arrow" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {visibleCategories.every((cat) => getCategoryApps(cat.key).length === 0) && (
          <div className="text-center py-16 text-slate-400 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60">
            <Search size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No applications match "{search}"
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching by module name (e.g. Invoicing, Inventory, CRM, MRP)
            </p>
          </div>
        )}
      </div>

      {/* ================================================================
         MODAL 1: SET YOUR BUSINESS
         ================================================================ */}
      {activeModal === 'business' && (
        <div className="o-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="o-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="o-modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600">
                  <DoodleTarget size={28} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
                    Set your business
                  </div>
                  <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Configure company legal details and corporate financial parameters
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="o-modal-body space-y-4 text-xs">
              <div className="o-field">
                <label>Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. ODD GEN Global Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="o-field">
                  <label>Base Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                  </select>
                </div>
                <div className="o-field">
                  <label>GSTIN / Tax Registration</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                  />
                </div>
              </div>
              <div className="o-field">
                <label>Headquarters Address</label>
                <input type="text" defaultValue="Level 5, Tower B, Cyber City, Bangalore 560001" />
              </div>
            </div>

            <div className="o-modal-footer">
              <button onClick={() => setActiveModal(null)} className="o-btn">
                Cancel
              </button>
              <button onClick={handleSaveSettings} className="o-btn o-btn-primary flex items-center gap-1.5">
                <Save size={14} />
                <span>{savedAlert ? 'Saved!' : 'Save Details'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
         MODAL 2: ADD YOUR LOGO
         ================================================================ */}
      {activeModal === 'logo' && (
        <div className="o-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="o-modal max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="o-modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                  <DoodleDocument size={28} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
                    Add your logo
                  </div>
                  <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Personalize your invoice headers and portal branding
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="o-modal-body space-y-4 text-xs text-center">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 hover:border-[#714B67] transition cursor-pointer">
                <DoodleDocument size={44} className="mx-auto mb-2" />
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Drop corporate logo here
                </div>
                <div className="text-slate-400 text-xs mt-1">PNG, JPG, SVG up to 5MB</div>
              </div>
            </div>

            <div className="o-modal-footer">
              <button onClick={() => setActiveModal(null)} className="o-btn">
                Close
              </button>
              <button onClick={handleSaveSettings} className="o-btn o-btn-primary">
                Save Logo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
         MODAL 3: SELECT ADDITIONAL FEATURES
         ================================================================ */}
      {activeModal === 'features' && (
        <div className="o-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="o-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="o-modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-50 text-cyan-600">
                  <DoodleSliders size={28} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
                    Select additional features
                  </div>
                  <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    All 26 enterprise modules are pre-connected and active
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="o-modal-body space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Sparkles size={16} />
                <span>All 26 enterprise modules are automatically enabled and interconnected for your business profile.</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 max-h-60 overflow-y-auto pr-1">
                {APPS.map((app) => {
                  const AppIcon = getOdooAppIcon(app.id);
                  return (
                    <div key={app.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <AppIcon size={20} />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{app.name}</span>
                      <span className="ml-auto text-[10px] text-emerald-600 font-bold">Active ✓</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="o-modal-footer">
              <button onClick={() => setActiveModal(null)} className="o-btn o-btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
         MODAL 4: CHOOSE YOUR FAVORITE THEME
         ================================================================ */}
      {activeModal === 'theme' && (
        <div className="o-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="o-modal max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="o-modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                  <DoodleBucket size={28} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
                    Choose your favorite theme
                  </div>
                  <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Light, dark, and signature enterprise accents
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="o-modal-body space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleTheme('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition ${
                    themeMode === 'light' ? 'border-[#714B67] bg-purple-50/50 text-[#714B67]' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Sun size={16} /> Light Mode
                </button>
                <button
                  onClick={() => toggleTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition ${
                    themeMode === 'dark' ? 'border-purple-400 bg-slate-800 text-purple-300' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Moon size={16} /> Dark Mode
                </button>
              </div>

              <div>
                <label className="font-semibold block mb-2 text-slate-700 dark:text-slate-300">Brand Accent Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Plum', hex: '#714B67' },
                    { label: 'Teal', hex: '#017E84' },
                    { label: 'Coral', hex: '#E11D48' },
                    { label: 'Amber', hex: '#D97706' },
                  ].map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => setAccentColor(col.hex)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 font-semibold transition ${
                        accentColor === col.hex ? 'border-[#714B67] ring-2 ring-[#714B67]/20' : 'border-slate-200'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full" style={{ backgroundColor: col.hex }} />
                      <span className="text-[11px]">{col.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="o-modal-footer">
              <button onClick={() => setActiveModal(null)} className="o-btn">
                Close
              </button>
              <button onClick={handleSaveSettings} className="o-btn o-btn-primary">
                {savedAlert ? 'Applied!' : 'Apply Theme'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
