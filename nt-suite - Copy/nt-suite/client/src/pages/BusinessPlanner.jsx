import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness, BUSINESS_PROFILES, getBusinessIcon } from '../context/BusinessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Building2, Laptop, Store, Factory, Briefcase, Wrench,
  Stethoscope, Palette, ArrowRight, CheckCircle2, Sparkles,
  Layers, ChevronRight, Compass, ShieldCheck, Box
} from 'lucide-react';

export default function BusinessPlanner() {
  const navigate = useNavigate();
  const { setBusiness, activeBusinessId } = useBusiness();
  const { user, login } = useAuth();
  const [selectedId, setSelectedId] = useState(activeBusinessId || 'it_company');
  const [launching, setLaunching] = useState(false);

  const selectedProfile = BUSINESS_PROFILES[selectedId] || BUSINESS_PROFILES.it_company;

  const handleLaunch = async () => {
    setLaunching(true);
    // Ensure user is logged in (demo admin fallback)
    if (!user) {
      try {
        await login('admin@ntos.dev', 'demo1234');
      } catch (err) {
        console.warn('Auto-login:', err);
      }
    }

    setBusiness(selectedId);

    setTimeout(() => {
      setLaunching(false);
      navigate('/');
    }, 600);
  };

  const CATEGORY_ICONS = {
    it_company: Laptop,
    private_org: Building2,
    small_business: Store,
    manufacturing: Factory,
    consulting: Briefcase,
    fieldservice: Wrench,
    healthcare: Stethoscope,
    creative: Palette,
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans selection:bg-[#017E84] selection:text-white py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top bar back link */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div
            onClick={() => navigate('/landing')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="font-extrabold text-2xl tracking-tight text-[#714B67]">
              odoo<span className="text-[#017E84]">.suite</span>
            </span>
            <span className="text-[10px] font-bold uppercase bg-teal-100 text-[#017E84] px-2 py-0.5 rounded-md">
              BUSINESS ONBOARDING
            </span>
          </div>

          <button
            onClick={() => navigate('/landing')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Landing Page
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#017E84] flex items-center justify-center gap-1">
            <Sparkles size={14} />
            <span>Step 2 of 2: Industry Workspace Setup</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif italic text-slate-900 font-bold">
            What are you <span className="text-[#017E84]">planning?</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Choose your organization type. All 26 enterprise modules, chart of accounts, dashboard KPIs,
            and spatial layouts will automatically configure to your industry.
          </p>
        </div>

        {/* Industry Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(BUSINESS_PROFILES).map((profile) => {
            const isSelected = selectedId === profile.id;
            const IconComponent = CATEGORY_ICONS[profile.id] || Building2;

            return (
              <div
                key={profile.id}
                onClick={() => setSelectedId(profile.id)}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#017E84] shadow-xl ring-2 ring-[#017E84]/20 transform -translate-y-1'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[#017E84]">
                    <CheckCircle2 size={18} />
                  </div>
                )}

                <div className="space-y-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: profile.iconBg || `${profile.themeColor}18`, color: profile.iconColor || profile.themeColor }}
                  >
                    {(() => { const PIcon = getBusinessIcon(profile.iconName); return <PIcon size={22} strokeWidth={2} />; })()}
                  </div>

                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${profile.themeColor}20`, color: profile.themeColor }}
                    >
                      {profile.badge}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 mt-2 group-hover:text-[#017E84] transition">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {profile.tagline}
                    </p>
                  </div>
                </div>

                {/* Priority Apps Pills */}
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Core Configured Apps:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {profile.featuredAppIds.slice(0, 3).map((appId) => (
                      <span
                        key={appId}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize"
                      >
                        {appId}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                      +18 more
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Industry Preview & Launch Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: selectedProfile.iconBg || `${selectedProfile.themeColor}20`, color: selectedProfile.iconColor || selectedProfile.themeColor }}
              >
                {(() => { const SIcon = getBusinessIcon(selectedProfile.iconName); return <SIcon size={22} strokeWidth={2} />; })()}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#017E84] tracking-wider">
                  Configuring Workspace
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedProfile.name}
                </h2>
              </div>
            </div>

            <span className="o-badge o-badge-teal text-xs">
              26 MODULES READY
            </span>
          </div>

          {/* Real-time configured KPIs preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Auto-Configured Business Dashboard Metrics:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedProfile.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 block truncate">{kpi.label}</span>
                  <div className="font-bold text-slate-800 text-sm">{kpi.value}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">{kpi.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spatial Pre-configuration preview */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Box size={16} className="text-[#714B67]" />
              <span>
                <strong>Spatial Infrastructure Preset:</strong> {selectedProfile.spatialRoomName}
              </span>
            </div>
            <span className="o-badge o-badge-purple text-[10px]">Auto-CAD Ready</span>
          </div>

          {/* Launch Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              You can switch industries anytime via the top bar in your dashboard.
            </div>

            <button
              onClick={handleLaunch}
              disabled={launching}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-[#017E84] hover:bg-[#01696e] rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>{launching ? 'Configuring 26 Modules...' : `Launch 26 Modules for ${selectedProfile.shortName}`}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
