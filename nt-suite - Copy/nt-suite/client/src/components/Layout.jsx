import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBusiness, getBusinessIcon } from '../context/BusinessContext.jsx';
import { api } from '../lib/api.js';
import {
  LayoutGrid, Search, Bell, Sun, Moon, MessageSquare, LogOut,
  ChevronRight, X, User, Settings, Sparkles, Box, ChevronDown,
  Building2, Globe, ArrowUpRight
} from 'lucide-react';

const TITLES = {
  '/': ['Home Apps', 'All 26 Modules'],
  '/spatial-ai': ['Spatial AI', 'Physical Infrastructure ERP'],
  '/dashboard': ['Dashboard', 'Executive Overview'],
  '/crm': ['CRM', 'Pipeline'],
  '/sales': ['Sales', 'Orders'],
  '/purchase': ['Purchase', 'Orders'],
  '/invoicing': ['Invoicing', 'Accounting'],
  '/inventory': ['Inventory', 'Products & Stock'],
  '/mrp': ['Manufacturing', 'Orders & BOMs'],
  '/pos': ['Point of Sale', 'Cashier'],
  '/subscriptions': ['Subscriptions', 'Recurring Revenue'],
  '/projects': ['Project', 'Tasks'],
  '/timesheets': ['Timesheets', 'Time Tracking'],
  '/hr': ['Employees', 'Human Resources'],
  '/helpdesk': ['Helpdesk', 'Support Tickets'],
  '/calendar': ['Calendar', 'Events'],
  '/contacts': ['Contacts', 'Partners'],
  '/knowledge': ['Knowledge', 'Articles'],
  '/documents': ['Documents', 'File Manager'],
  '/discuss': ['Discuss', 'Messaging'],
  '/sign': ['Sign', 'Electronic Signatures'],
  '/fieldservice': ['Field Service', 'Work Orders'],
  '/planning': ['Planning', 'Shift Scheduling'],
  '/marketing': ['Email Marketing', 'Campaigns'],
  '/ecommerce': ['eCommerce', 'Online Store'],
  '/studio': ['Studio', 'Customization'],
  '/ai': ['AI Assistant', 'Business Intelligence'],
  '/settings': ['Settings', 'Configuration'],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const { activeBusiness, setBusiness, allBusinesses } = useBusiness();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [businessMenuOpen, setBusinessMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('ntos_theme') || 'light');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
        setUserMenuOpen(false);
        setBusinessMenuOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    api.get('/notifications').then(setNotifs).catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ntos_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  const [title, sub] = TITLES[location.pathname] || ['ODD GEN', ''];
  const initials = (user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const unread = notifs.filter(n => !n.read).length;
  const isHome = location.pathname === '/';

  const SEARCH_ITEMS = Object.entries(TITLES)
    .filter(([p]) => p !== '/')
    .map(([path, [label, desc]]) => ({ path, label, desc }));

  const filtered = searchQuery
    ? SEARCH_ITEMS.filter(
        i =>
          i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_ITEMS;

  // Get active business SVG icon
  const ActiveBusinessIcon = getBusinessIcon(activeBusiness.iconName);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg)' }}>
      {/* Top Navigation Bar */}
      <div className="o-topbar">
        {/* Apps Grid Button */}
        <div className="o-menu-btn" onClick={() => navigate('/')} title="Apps Launcher">
          <LayoutGrid size={18} />
        </div>

        {/* Dynamic Business Mode Switcher */}
        <div className="relative">
          <button
            onClick={() => setBusinessMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            style={{
              background: `${activeBusiness.iconBg}`,
              color: activeBusiness.iconColor,
              border: `1px solid ${activeBusiness.iconColor}20`,
            }}
            title="Switch Industry Profile"
          >
            <ActiveBusinessIcon size={15} strokeWidth={2.2} />
            <span className="hidden md:inline">{activeBusiness.shortName}</span>
            <ChevronDown size={12} className="opacity-75" />
          </button>

          {businessMenuOpen && (
            <div
              className="absolute left-0 top-10 shadow-2xl rounded-2xl z-50 w-72 text-xs p-2 animate-fade-in space-y-1"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="p-2 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <span className="font-bold" style={{ color: 'var(--ink)' }}>Active Industry Profile</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--accent-teal-bg)', color: 'var(--accent-teal)' }}>
                  26 Apps Active
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
                {allBusinesses.map((b) => {
                  const BIcon = getBusinessIcon(b.iconName);
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setBusiness(b.id);
                        setBusinessMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl text-left flex items-center justify-between transition"
                      style={{
                        background: activeBusiness.id === b.id ? `${b.iconBg}` : 'transparent',
                        color: activeBusiness.id === b.id ? b.iconColor : 'var(--ink-secondary)',
                        fontWeight: activeBusiness.id === b.id ? 700 : 400,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="business-icon-box-sm"
                          style={{ backgroundColor: b.iconBg, color: b.iconColor }}
                        >
                          <BIcon size={14} strokeWidth={2.2} />
                        </div>
                        <div>
                          <div className="leading-tight" style={{ fontSize: 12 }}>{b.name}</div>
                          <div className="text-[10px]" style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>{b.badge}</div>
                        </div>
                      </div>
                      {activeBusiness.id === b.id && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-teal)' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center px-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => {
                    setBusinessMenuOpen(false);
                    navigate('/start-business');
                  }}
                  className="text-[11px] font-bold hover:underline flex items-center gap-0.5"
                  style={{ color: 'var(--odoo-primary)' }}
                >
                  Planner Wizard →
                </button>
                <button
                  onClick={() => {
                    setBusinessMenuOpen(false);
                    navigate('/landing');
                  }}
                  className="text-[11px] hover:underline flex items-center gap-0.5"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  <Globe size={11} /> Landing Page
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        {!isHome && (
          <div className="o-breadcrumb">
            <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => navigate('/')}>Apps</span>
            <ChevronRight size={12} className="sep" />
            <span>{title}</span>
            {sub && (
              <>
                <ChevronRight size={12} className="sep" />
                <span style={{ fontWeight: 400, opacity: 0.8 }}>{sub}</span>
              </>
            )}
          </div>
        )}

        {/* Search */}
        <div className="o-search-box" onClick={() => setSearchOpen(true)}>
          <Search size={14} />
          <span>Search modules…</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6, border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px' }}>⌘K</span>
        </div>

        {/* Spatial AI Direct Button */}
        <button
          onClick={() => navigate('/spatial-ai')}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ml-2"
          style={{
            background: 'var(--accent-purple-bg)',
            color: 'var(--accent-purple)',
            border: '1px solid var(--accent-purple)20',
          }}
        >
          <Box size={13} />
          <span className="hidden sm:inline">Spatial Studio</span>
        </button>

        {/* Landing page link */}
        <button
          onClick={() => navigate('/landing')}
          className="px-2 py-1 rounded text-xs flex items-center gap-1 transition"
          style={{ color: 'var(--ink-faint)' }}
          title="View Landing Page"
        >
          <Globe size={14} />
          <span className="hidden lg:inline">Landing</span>
        </button>

        {/* Right Side Icons */}
        <div className="o-icon-btn" onClick={() => navigate('/discuss')} title="Messages">
          <MessageSquare size={17} />
        </div>

        <div className="o-icon-btn" onClick={() => setNotifOpen(v => !v)} title="Notifications">
          <Bell size={17} />
          {unread > 0 && <div className="o-notif-dot" />}
        </div>

        <div className="o-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </div>

        {/* User Avatar */}
        <div style={{ position: 'relative' }}>
          <div className="o-avatar" onClick={() => setUserMenuOpen(v => !v)}>
            {initials}
          </div>
          {userMenuOpen && (
            <div
              className="absolute right-0 top-10 shadow-xl rounded-xl z-50 w-52 text-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{user?.email}</div>
              </div>
              <div
                className="p-2.5 cursor-pointer flex items-center gap-2 transition"
                style={{ color: 'var(--ink-secondary)' }}
                onClick={() => { setUserMenuOpen(false); navigate('/start-business'); }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Building2 size={14} /> Change Business Type
              </div>
              <div
                className="p-2.5 cursor-pointer flex items-center gap-2 transition"
                style={{ color: 'var(--ink-secondary)' }}
                onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Settings size={14} /> Settings
              </div>
              <div
                className="p-2.5 cursor-pointer flex items-center gap-2 font-medium transition"
                style={{ color: '#E11D48' }}
                onClick={() => { setUserMenuOpen(false); logout(); }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-rose-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={14} /> Sign out
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Dropdown */}
      {notifOpen && (
        <div style={{ position: 'fixed', top: 'var(--topbar-h)', right: 12, zIndex: 300 }}>
          <div className="shadow-xl rounded-xl" style={{ width: 340, maxHeight: 400, overflowY: 'auto', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ padding: '8px 12px', fontWeight: 600, fontSize: 14, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink)' }}>
              Notifications
              <X size={16} style={{ cursor: 'pointer', color: 'var(--ink-muted)' }} onClick={() => setNotifOpen(false)} />
            </div>
            {notifs.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13 }}>No notifications</div>
            )}
            {notifs.map(n => (
              <div key={n.id} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-light)', fontSize: 13, color: 'var(--ink)' }}>
                <div>{n.text}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 3 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Command Palette */}
      {searchOpen && (
        <div className="o-modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="o-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={18} style={{ color: 'var(--ink-muted)' }} />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules, apps, pages…"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: 'var(--ink)' }}
              />
              <span style={{ fontSize: 10, color: 'var(--ink-faint)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>ESC</span>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto', padding: 6 }}>
              {filtered.map(item => (
                <div
                  key={item.path}
                  onClick={() => { navigate(item.path); setSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 rounded-lg cursor-pointer flex justify-between items-center text-xs transition"
                  style={{ color: 'var(--ink)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span className="font-semibold">{item.label}</span>
                  <span style={{ color: 'var(--ink-faint)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto" key={location.pathname}>
        <Outlet />
      </div>
    </div>
  );
}
