import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness, getBusinessIcon } from '../context/BusinessContext.jsx';
import { api } from '../lib/api.js';
import {
  TrendingUp, Users, DollarSign, Package, CheckSquare,
  AlertCircle, ArrowUpRight, ArrowDownRight, Clock,
  Calendar, ShoppingCart, RefreshCw, Box, Building2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const revenueData = [
    { month: 'Apr', revenue: 42000, target: 35000 },
    { month: 'May', revenue: 58000, target: 45000 },
    { month: 'Jun', revenue: 64000, target: 55000 },
    { month: 'Jul', revenue: 78000, target: 65000 },
    { month: 'Aug', revenue: 92000, target: 75000 },
    { month: 'Sep', revenue: 114500, target: 90000 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
              Executive Dashboard
            </h1>
            {activeBusiness && (
              <span className="o-badge o-badge-teal text-[10px] flex items-center gap-1">
                {(() => { const BIcon = getBusinessIcon(activeBusiness.iconName); return <BIcon size={12} strokeWidth={2.2} />; })()} {activeBusiness.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {activeBusiness ? activeBusiness.tagline : 'Real-time business intelligence across sales, operations, finance, and physical spatial infrastructure'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/start-business')} className="o-btn o-btn-sm flex items-center gap-1">
            <Building2 size={13} />
            <span>Switch Business</span>
          </button>
          <button onClick={() => navigate('/spatial-ai')} className="o-btn o-btn-sm o-btn-teal flex items-center gap-1.5">
            <Box size={14} />
            <span>Spatial AI</span>
          </button>
          <button onClick={() => navigate('/crm')} className="o-btn o-btn-sm o-btn-primary">
            CRM Pipeline
          </button>
        </div>
      </div>

      {/* Top Stat KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="o-stat cursor-pointer" onClick={() => navigate('/sales')}>
          <span className="o-stat-label">Total Revenue</span>
          <span className="o-stat-value text-[#714B67] dark:text-purple-400">
            ₹{(data?.totalRevenue || 114500).toLocaleString('en-IN')}
          </span>
          <span className="o-stat-trend up">
            <ArrowUpRight size={13} /> +18.4% vs last period
          </span>
        </div>

        <div className="o-stat cursor-pointer" onClick={() => navigate('/crm')}>
          <span className="o-stat-label">Active Pipeline</span>
          <span className="o-stat-value text-[#017E84] dark:text-teal-400">
            ₹{(data?.pipelineValue || 167900).toLocaleString('en-IN')}
          </span>
          <span className="o-stat-sub">Across 8 qualified opportunities</span>
        </div>

        <div className="o-stat cursor-pointer" onClick={() => navigate('/invoicing')}>
          <span className="o-stat-label">Overdue Invoices</span>
          <span className="o-stat-value text-rose-600">
            ₹{(data?.overdueAmount || 4300).toLocaleString('en-IN')}
          </span>
          <span className="o-stat-sub text-rose-500 font-medium">1 invoice requires follow-up</span>
        </div>

        <div className="o-stat cursor-pointer" onClick={() => navigate('/inventory')}>
          <span className="o-stat-label">Low Stock Alerts</span>
          <span className="o-stat-value text-amber-600">2 Items</span>
          <span className="o-stat-sub">Below safety threshold</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 o-card">
          <div className="o-card-header">
            <div>
              <h3 className="o-card-title">Revenue Trajectory & Forecast</h3>
              <p className="text-xs text-gray-500">Actual sales vs monthly targets</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#714B67" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#714B67" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Launch & Alerts */}
        <div className="o-card flex flex-col justify-between">
          <div>
            <h3 className="o-card-title mb-3">Priority Operations</h3>
            <div className="space-y-3 text-xs">
              <div
                onClick={() => navigate('/invoicing')}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 cursor-pointer hover:shadow-sm transition"
              >
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-900 dark:text-rose-200">Invoice INV-3088 Overdue</div>
                  <div className="text-rose-700 dark:text-rose-300 text-[11px] mt-0.5">Kestrel Logistics — ₹4,300 outstanding</div>
                </div>
              </div>

              <div
                onClick={() => navigate('/spatial-ai')}
                className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-2.5 cursor-pointer hover:shadow-sm transition"
              >
                <Box size={16} className="text-[#714B67] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-purple-900 dark:text-purple-200">Spatial AI Digital Twin</div>
                  <div className="text-purple-700 dark:text-purple-300 text-[11px] mt-0.5">HVAC Downscaling ready (Save ₹8,400/mo)</div>
                </div>
              </div>

              <div
                onClick={() => navigate('/inventory')}
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 cursor-pointer hover:shadow-sm transition"
              >
                <Package size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900 dark:text-amber-200">Replenishment Alert</div>
                  <div className="text-amber-700 dark:text-amber-300 text-[11px] mt-0.5">Carbon Task Chair (18 in stock / 25 reorder)</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-xs font-semibold rounded-lg transition text-gray-700 dark:text-gray-200"
          >
            Browse All 20+ Enterprise Apps →
          </button>
        </div>
      </div>
    </div>
  );
}
