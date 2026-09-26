import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  RefreshCw, TrendingUp, Users, DollarSign, Plus, CheckCircle,
  PauseCircle, XCircle, Calendar, ArrowUpRight
} from 'lucide-react';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSubModal, setNewSubModal] = useState(false);

  // Form states
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/subscriptions'),
      api.get('/subscriptions/plans'),
      api.get('/contacts')
    ]).then(([subRes, planRes, partRes]) => {
      setSubscriptions(subRes || []);
      setPlans(planRes || []);
      setPartners(partRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.mrr || 0), 0);
  const totalARR = totalMRR * 12;
  const activeCount = subscriptions.filter(s => s.status === 'active').length;

  const handleCreateSub = async (e) => {
    e.preventDefault();
    if (!selectedPartnerId || !selectedPlanId) return;
    try {
      await api.post('/subscriptions', {
        partnerId: Number(selectedPartnerId),
        planId: Number(selectedPlanId)
      });
      setNewSubModal(false);
      setSelectedPartnerId('');
      setSelectedPlanId('');
      loadData();
    } catch (err) {
      alert('Error creating subscription: ' + err.message);
    }
  };

  const handleUpdateStatus = async (subId, status) => {
    try {
      await api.put(`/subscriptions/${subId}`, { status });
      loadData();
    } catch (err) {
      alert('Error updating subscription: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="text-[#E67E22]" /> Subscriptions & Recurring Revenue
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor Monthly Recurring Revenue (MRR), automated renewal schedules, and churn rate
          </p>
        </div>

        <button
          onClick={() => setNewSubModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Subscription
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="o-stat">
          <span className="o-stat-label">Monthly Recurring Revenue (MRR)</span>
          <span className="o-stat-value text-[#714B67] dark:text-purple-400">
            ₹{totalMRR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
          <span className="o-stat-sub text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +14.2% vs last month
          </span>
        </div>

        <div className="o-stat">
          <span className="o-stat-label">Annual Run Rate (ARR)</span>
          <span className="o-stat-value text-gray-900 dark:text-white">
            ₹{totalARR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
          <span className="o-stat-sub">Projected 12-month value</span>
        </div>

        <div className="o-stat">
          <span className="o-stat-label">Active Subscribers</span>
          <span className="o-stat-value text-[#017E84] dark:text-teal-400">
            {activeCount}
          </span>
          <span className="o-stat-sub">{subscriptions.length} total accounts</span>
        </div>
      </div>

      {/* Plans Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="o-card border-t-4 border-t-[#714B67]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <span className="o-badge o-badge-teal">{plan.billingPeriod}</span>
            </div>
            <div className="text-2xl font-extrabold text-[#714B67] dark:text-purple-400 mb-2">
              ₹{plan.price} <span className="text-xs font-normal text-gray-500">/{plan.billingPeriod === 'yearly' ? 'yr' : 'mo'}</span>
            </div>
            <p className="text-xs text-gray-500">Plan Code: {plan.code}</p>
          </div>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>Subscription #</th>
              <th>Customer</th>
              <th>Plan</th>
              <th>MRR</th>
              <th>Status</th>
              <th>Next Renewal Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No active subscriptions. Click "New Subscription" to enroll a customer.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="font-semibold text-[#714B67] dark:text-purple-400">
                    {sub.code}
                  </td>
                  <td className="font-medium text-gray-900 dark:text-white">
                    {sub.partner?.name}
                  </td>
                  <td>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {sub.plan?.name}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-1.5">
                      ({sub.plan?.billingPeriod})
                    </span>
                  </td>
                  <td className="font-bold text-gray-900 dark:text-white">
                    ₹{sub.mrr.toFixed(2)}/mo
                  </td>
                  <td>
                    {sub.status === 'active' && <span className="o-badge o-badge-success">Active</span>}
                    {sub.status === 'paused' && <span className="o-badge o-badge-warning">Paused</span>}
                    {sub.status === 'cancelled' && <span className="o-badge o-badge-danger">Cancelled</span>}
                  </td>
                  <td className="text-xs text-gray-500">
                    {new Date(sub.nextBill).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {sub.status === 'active' && (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'paused')}
                          className="o-btn o-btn-sm o-btn-ghost text-amber-600 hover:bg-amber-50"
                        >
                          Pause
                        </button>
                      )}
                      {sub.status === 'paused' && (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'active')}
                          className="o-btn o-btn-sm o-btn-ghost text-emerald-600 hover:bg-emerald-50"
                        >
                          Resume
                        </button>
                      )}
                      {sub.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'cancelled')}
                          className="o-btn o-btn-sm o-btn-ghost text-rose-600 hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Subscription Modal */}
      {newSubModal && (
        <div className="o-modal-overlay">
          <div className="o-modal">
            <div className="o-modal-header">
              <span>Create Recurring Subscription</span>
              <button onClick={() => setNewSubModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateSub}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Select Customer / Partner:</label>
                  <select
                    required
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                  >
                    <option value="">-- Choose Customer --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.company || 'Individual'})</option>
                    ))}
                  </select>
                </div>

                <div className="o-field">
                  <label>Select Subscription Plan:</label>
                  <select
                    required
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                  >
                    <option value="">-- Choose Plan --</option>
                    {plans.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name} — ₹{pl.price}/{pl.billingPeriod}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewSubModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Activate Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
