import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ArrowRight, Check, Play, Zap, Shield, Smartphone,
  Building2, TrendingUp, Sparkles, ChevronRight, ExternalLink,
  Percent, ShoppingCart, ShoppingBag, Package, Factory,
  Store, RefreshCw, Box, CheckCircle2, Star, Clock, Globe,
  HelpCircle, MessageSquare
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [activeVideoModal, setActiveVideoModal] = useState(false);

  // Quick launch into business planner
  const handleStartBusiness = async () => {
    // If not logged in, auto-authenticate with demo admin seamlessly
    if (!user) {
      try {
        await login('admin@ntos.dev', 'demo1234');
      } catch (err) {
        console.warn('Auto-login fallback:', err);
      }
    }
    navigate('/start-business');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans selection:bg-[#017E84] selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. Authentic Odoo Top Navigation Bar */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="font-extrabold text-2xl tracking-tight text-[#714B67]">
              odoo<span className="text-[#017E84]">.suite</span>
            </span>
            <span className="text-[10px] font-bold uppercase bg-purple-100 text-[#714B67] px-2 py-0.5 rounded-md tracking-wider">
              ENTERPRISE 26+
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={handleStartBusiness} className="hover:text-[#714B67] transition">
              Start Business
            </button>
            <a href="#apps" className="hover:text-[#714B67] transition">
              Apps (26)
            </a>
            <a href="#performance" className="hover:text-[#714B67] transition">
              Performance
            </a>
            <a href="#testimonials" className="hover:text-[#714B67] transition">
              Community
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Open Suite (Logged in as {user.name})
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Sign In
            </button>
          )}

          <button
            onClick={handleStartBusiness}
            className="px-5 py-2 text-xs font-bold text-white bg-[#017E84] hover:bg-[#01696e] rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5"
          >
            <span>Start your business</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. Hero Section (Matches PDF Page 1) */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-16 pb-20 px-6 max-w-5xl mx-auto text-center relative">
        {/* Handwritten / Script Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
          <span className="font-serif italic font-normal text-slate-800">Business made</span>{' '}
          <span className="text-[#017E84] font-serif italic underline decoration-[#017E84]/30 decoration-wavy">
            effortless
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Imagine one AI-native platform for all your business operations, from invoicing and CRM
          to manufacturing, supply chain, and real-time spatial planning. Fast, complete, and simple.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <button
            onClick={handleStartBusiness}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-800 bg-white border-2 border-slate-300 hover:border-[#017E84] rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Start your business — It's free</span>
            <ArrowRight size={16} className="text-[#017E84]" />
          </button>

          <button
            onClick={() => handleStartBusiness()}
            className="w-full sm:w-auto px-6 py-4 text-sm font-bold text-slate-700 hover:text-slate-900 transition flex items-center justify-center gap-1"
          >
            <span>Meet an advisor</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-8">
          Send and receive unlimited invoices, sales orders, and bills, for free, forever.{' '}
          <span className="text-[#017E84] cursor-pointer hover:underline font-medium">See why</span>
        </p>

        {/* Indian Flag / GST Compliant Pill */}
        <div className="relative inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="w-5 h-3.5 rounded-xs flex flex-col overflow-hidden border border-slate-300 shadow-2xs">
            <span className="bg-[#FF9933] h-1.5 w-full" />
            <span className="bg-white h-1 w-full flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-900" />
            </span>
            <span className="bg-[#138808] h-1.5 w-full" />
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">100% GST Compliant & E-Invoicing Ready</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. Floating Interactive Dashboard Teaser (Matches PDF Page 2) */}
      {/* ------------------------------------------------------------- */}
      <section className="px-6 max-w-6xl mx-auto pb-24">
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 overflow-hidden group">
          {/* Top fake browser bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-3 font-semibold text-slate-700">Accounting / Dashboard / Customers / Vendors / Spatial</span>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-lg text-[11px]">1-5/5</div>
          </div>

          {/* Grid Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Invoices Card */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800">Customer Invoices</span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-[#714B67] text-xs font-bold">New</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-200">
                <span>1 To Validate</span>
                <span className="font-bold text-slate-800">₹44,275.00</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>5 Unpaid</span>
                <span className="font-bold text-slate-800">₹1,28,867.25</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-rose-600">
                <span>3 Late</span>
                <span className="font-bold">₹92,750.00</span>
              </div>

              {/* Chart Mock */}
              <div className="h-20 flex items-end gap-2 pt-4">
                <div className="w-1/5 bg-[#714B67]/20 hover:bg-[#714B67] h-[40%] rounded-t transition" />
                <div className="w-1/5 bg-[#714B67]/30 hover:bg-[#714B67] h-[65%] rounded-t transition" />
                <div className="w-1/5 bg-[#714B67]/40 hover:bg-[#714B67] h-[50%] rounded-t transition" />
                <div className="w-1/5 bg-[#714B67]/60 hover:bg-[#714B67] h-[85%] rounded-t transition" />
                <div className="w-1/5 bg-[#714B67] h-[100%] rounded-t" />
              </div>
            </div>

            {/* Vendor Bills Card */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800">Vendor Bills</span>
                <span className="px-2 py-0.5 rounded bg-teal-100 text-[#017E84] text-xs font-bold">Upload</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-200">
                <span>1 To Validate</span>
                <span className="font-bold text-slate-800">₹0.00</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>2 To Pay</span>
                <span className="font-bold text-slate-800">₹6,652.27</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>1 Late</span>
                <span className="font-bold text-slate-800">₹622.27</span>
              </div>

              {/* Bank Balance bar */}
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Primary Bank Balance</span>
                  <span className="text-base font-bold text-emerald-600">₹9,944.87</span>
                </div>
                <span className="o-badge o-badge-teal">Matched Automatically</span>
              </div>
            </div>
          </div>

          {/* Floating Avatar Callout (Matches PDF Page 2) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full border border-teal-200 shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#017E84] text-white flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <span className="text-xs font-bold text-slate-800">
              Looking for our simplified Invoicing & ERP app?
            </span>
            <button
              onClick={handleStartBusiness}
              className="px-3 py-1 bg-[#714B67] text-white rounded-full text-xs font-semibold hover:bg-[#5b3b52] transition flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. Speed & Performance (Matches PDF Page 2 & 3) */}
      {/* ------------------------------------------------------------- */}
      <section id="performance" className="py-20 px-6 max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-serif italic text-slate-900 font-bold">
            Unlock true performance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-lg font-serif italic">
              <Clock size={24} className="text-rose-500" />
              <span>90 milliseconds login to vendor bill</span>
            </div>

            <p className="text-base text-slate-600 leading-relaxed">
              Speed matters. All operations are processed in less than 90 milliseconds, faster than
              the blink of an eye. It helps teams and operators do much more in less time.
            </p>

            <p className="text-sm font-semibold text-slate-800">
              A snappy interface is a game changer.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-700">BILL/2026/09/0001</span>
              <span className="text-emerald-600 font-bold">Processed in 84ms</span>
            </div>
            <div className="space-y-1.5 text-slate-500">
              <div className="flex justify-between"><span>Azure Interior</span><span>11/09/2026</span></div>
              <div className="flex justify-between"><span>Payment Reference</span><span>Verified</span></div>
              <div className="flex justify-between text-slate-900 font-bold pt-2 border-t"><span>Total Amount</span><span>₹3,450.00</span></div>
            </div>
          </div>
        </div>

        {/* Zero Data Entry Section (Matches PDF Page 3) */}
        <div className="text-center space-y-4 pt-10">
          <h2 className="text-4xl sm:text-5xl font-serif italic text-slate-900 font-bold">
            No data entry! <span className="text-[#017E84]">Just automation</span>
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Experience zero data entry. Our advanced AI-powered document data capture has a 98%
            recognition rate. All you have to do is validate the invoice.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. Mobile Experience & Bank Sync (Matches PDF Page 4, 5, 6) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-16 border-t border-slate-200/80">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-amber-500 text-sm font-bold">
            <Star size={18} fill="currentColor" />
            <span>MOBILE FIRST</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif italic text-slate-900 font-bold">
            Enjoy the mobile experience
          </h2>
          <p className="text-base text-slate-600 max-w-lg mx-auto">
            Your mobile companion. Take pictures of your expenses, scan room layouts with LiDAR, and let
            the Artificial Intelligence do the rest!
          </p>
        </div>

        {/* Bank Sync & Reconciliation Section */}
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-[#714B67]">
              <span>🏛️ 28,000+ banks supported</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Bank synchronization
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never import bank statements manually again. Odoo integrates with 28,000 banks from all around the world!
            </p>

            <div className="pt-2">
              <h4 className="text-base font-bold text-slate-800">Smart AI matching</h4>
              <p className="text-xs text-slate-500 mt-1">
                95% of transactions are matched automatically with financial & customer records.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400 border-b pb-2">
              <span>TRANSACTION</span>
              <span>AMOUNT</span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-slate-700">
              <span>Telecom Mobile plan</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">₹96.67 <Check size={12} /></span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-slate-700 bg-teal-50 px-2 rounded">
              <span>Deco Addict INV/00305</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">₹750.00 <Check size={12} /></span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-slate-700">
              <span>Office Rent Sept</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">₹2,000.00 <Check size={12} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. Modular Ecosystem: "One need, one app" (Matches PDF Page 9) */}
      {/* ------------------------------------------------------------- */}
      <section id="apps" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#017E84] flex items-center justify-center gap-1">
            <span>See all 26 features</span>
            <ArrowRight size={13} />
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif italic text-slate-900 font-bold">
            One need, <span className="text-[#714B67]">one app.</span>
          </h2>
          <p className="text-base text-slate-500">Expand as your business grows.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: 'Spatial AI', desc: 'Room CAD & physical design', icon: Box, color: '#E11D48', bg: '#FFE5EC' },
            { name: 'Sales Orders', desc: 'Generate quotes & invoices', icon: ShoppingCart, color: '#9D4EDD', bg: '#F3E8FF' },
            { name: 'Purchase Hub', desc: 'Vendor bills & RFQs', icon: ShoppingBag, color: '#00C897', bg: '#E2FBF5' },
            { name: 'Invoicing & Finance', desc: 'GST bills & reconciliation', icon: Percent, color: '#00BAF2', bg: '#E0F7FF' },
            { name: 'Inventory Core', desc: 'Real-time stock valuation', icon: Package, color: '#FF6584', bg: '#FFE5EC' },
            { name: 'Manufacturing MRP', desc: 'BOMs & assembly lines', icon: Factory, color: '#00BAF2', bg: '#E0F7FF' },
            { name: 'Point of Sale', desc: 'Touchscreen retail cashier', icon: Store, color: '#FFB703', bg: '#FFF3CD' },
            { name: 'Subscriptions MRR', desc: 'Recurring customer revenue', icon: RefreshCw, color: '#9D4EDD', bg: '#F3E8FF' },
          ].map((app, idx) => {
            const Icon = app.icon;
            return (
              <div
                key={idx}
                onClick={handleStartBusiness}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition group-hover:scale-110"
                    style={{ backgroundColor: app.bg, color: app.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#017E84] transition">
                      {app.name}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{app.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleStartBusiness}
            className="o-btn o-btn-teal text-xs font-bold py-3 px-6 shadow-sm inline-flex items-center gap-2"
          >
            <span>Configure your business with all 26 apps</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. Social Proof: KPMG Quote (Matches PDF Page 10) */}
      {/* ------------------------------------------------------------- */}
      <section id="testimonials" className="py-20 px-6 max-w-4xl mx-auto text-center space-y-10 border-t border-slate-200/80">
        <h2 className="text-4xl sm:text-5xl font-serif italic text-slate-900 font-bold">
          Join 28 million users
        </h2>
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 -mt-6">
          who grow their business with Odoo
        </p>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6 text-left">
          <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed font-serif italic">
            "A VAT closing that used to take 4 days is now done in 3 hours with Odoo, with a better service for our clients: real-time accounting."
          </p>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-300">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Wim Van den Brande"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Wim Van den Brande</div>
                <div className="text-[11px] text-slate-400">Head of Tax, Legal & Accountancy</div>
              </div>
            </div>

            <span className="font-black text-xl tracking-tighter text-blue-800">
              KPMG
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. Closing CTA with Sunburst (Matches PDF Page 11) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-8 relative">
        {/* Radiant Executive Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mb-2 shadow-xs">
          <Sparkles size={28} />
        </div>

        <h2 className="text-5xl sm:text-6xl font-serif italic text-slate-900 font-bold">
          Unleash <span className="text-[#017E84]">your growth potential</span>
        </h2>

        <div className="pt-2">
          <button
            onClick={handleStartBusiness}
            className="px-10 py-5 text-base font-bold text-slate-900 bg-white border-2 border-slate-300 hover:border-[#017E84] rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 inline-flex items-center gap-2"
          >
            <span>Start now — It's free</span>
            <ArrowRight size={18} className="text-[#017E84]" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-teal-600 text-sm font-semibold">
          <span>↑</span>
          <span>No credit card required · Instant access</span>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. Authentic Footer (Matches PDF Page 12) */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-slate-200 bg-white py-16 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-sm block mb-3">Community</span>
            <div className="hover:text-slate-900 cursor-pointer">Tutorials</div>
            <div className="hover:text-slate-900 cursor-pointer">Documentation</div>
            <div className="hover:text-slate-900 cursor-pointer">Forum</div>
            <div className="hover:text-slate-900 cursor-pointer">Odoo.sh Hosting</div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-sm block mb-3">Open Source</span>
            <div className="hover:text-slate-900 cursor-pointer">Download</div>
            <div className="hover:text-slate-900 cursor-pointer">Github</div>
            <div className="hover:text-slate-900 cursor-pointer">Runbot</div>
            <div className="hover:text-slate-900 cursor-pointer">Translations</div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-sm block mb-3">Services</span>
            <div className="hover:text-slate-900 cursor-pointer">Support</div>
            <div className="hover:text-slate-900 cursor-pointer">Upgrade</div>
            <div className="hover:text-slate-900 cursor-pointer">Custom Developments</div>
            <div className="hover:text-slate-900 cursor-pointer">Find a Partner</div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-sm block mb-3">Our Company</span>
            <div className="hover:text-slate-900 cursor-pointer">Brand Assets</div>
            <div className="hover:text-slate-900 cursor-pointer">Contact Us</div>
            <div className="hover:text-slate-900 cursor-pointer">Jobs</div>
            <div className="hover:text-slate-900 cursor-pointer">Legal · Privacy · Security</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 max-w-xl text-center sm:text-left text-[11px] leading-relaxed">
            Odoo is a suite of open source business apps that cover all your company needs: CRM, eCommerce,
            accounting, inventory, point of sale, project management, and physical spatial infrastructure.
          </p>
          <div className="font-semibold text-slate-600">Website made with ODD GEN Suite</div>
        </div>
      </footer>
    </div>
  );
}
