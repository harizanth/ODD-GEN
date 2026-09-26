import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Send, Plus, Users, Mail, MousePointer, CheckCircle,
  Clock, BarChart2, Eye, Flame
} from 'lucide-react';

export default function Marketing() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCampModal, setNewCampModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [target, setTarget] = useState('Customers');
  const [body, setBody] = useState('');

  const loadData = () => {
    api.get('/marketing/campaigns').then((res) => {
      setCampaigns(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!title || !subject) return;
    try {
      await api.post('/marketing/campaigns', {
        title,
        subject,
        target,
        body
      });
      setNewCampModal(false);
      setTitle('');
      setSubject('');
      setBody('');
      loadData();
    } catch (err) {
      alert('Error creating campaign: ' + err.message);
    }
  };

  const handleSendCampaign = async (id) => {
    try {
      await api.post(`/marketing/campaigns/${id}/send`);
      loadData();
    } catch (err) {
      alert('Error sending campaign: ' + err.message);
    }
  };

  const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.opened || 0), 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + (c.clicked || 0), 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Send className="text-[#5C6BC0]" /> Email Marketing Automation
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Design targeted email campaigns, segment leads, and track open/click conversion funnels
          </p>
        </div>

        <button
          onClick={() => setNewCampModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="o-stat">
          <span className="o-stat-label">Total Emails Sent</span>
          <span className="o-stat-value text-[#714B67] dark:text-purple-400">{totalSent.toLocaleString()}</span>
          <span className="o-stat-sub">Across all campaigns</span>
        </div>
        <div className="o-stat">
          <span className="o-stat-label">Average Open Rate</span>
          <span className="o-stat-value text-emerald-600">{avgOpenRate}%</span>
          <span className="o-stat-sub">{totalOpened.toLocaleString()} total opens</span>
        </div>
        <div className="o-stat">
          <span className="o-stat-label">Click-Through Rate (CTR)</span>
          <span className="o-stat-value text-[#017E84]">
            {totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : 0}%
          </span>
          <span className="o-stat-sub">{totalClicked.toLocaleString()} link clicks</span>
        </div>
        <div className="o-stat">
          <span className="o-stat-label">Active Campaigns</span>
          <span className="o-stat-value text-amber-600">{campaigns.length}</span>
          <span className="o-stat-sub">Automated & scheduled</span>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Email Subject</th>
              <th>Target Audience</th>
              <th>Sent</th>
              <th>Opens</th>
              <th>Clicks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No marketing campaigns created yet. Click "New Campaign" to launch one.
                </td>
              </tr>
            ) : (
              campaigns.map((camp) => (
                <tr key={camp.id}>
                  <td className="font-semibold text-gray-900 dark:text-white">
                    {camp.title}
                  </td>
                  <td className="text-xs text-gray-600 dark:text-gray-300">
                    {camp.subject}
                  </td>
                  <td>
                    <span className="o-badge o-badge-teal">{camp.target}</span>
                  </td>
                  <td className="font-semibold">{camp.sentCount}</td>
                  <td className="text-emerald-600 font-medium">
                    {camp.opened} {camp.sentCount > 0 && `(${((camp.opened / camp.sentCount) * 100).toFixed(0)}%)`}
                  </td>
                  <td className="text-[#017E84] font-medium">
                    {camp.clicked} {camp.opened > 0 && `(${((camp.clicked / camp.opened) * 100).toFixed(0)}%)`}
                  </td>
                  <td>
                    {camp.status === 'sent' ? (
                      <span className="o-badge o-badge-success">Delivered</span>
                    ) : camp.status === 'queued' ? (
                      <span className="o-badge o-badge-warning">Queued</span>
                    ) : (
                      <span className="o-badge o-badge-muted">Draft</span>
                    )}
                  </td>
                  <td>
                    {camp.status === 'draft' && (
                      <button
                        onClick={() => handleSendCampaign(camp.id)}
                        className="o-btn o-btn-sm o-btn-primary flex items-center gap-1"
                      >
                        <Send size={11} /> Send Now
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Campaign Modal */}
      {newCampModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-lg">
            <div className="o-modal-header">
              <span>Create Email Campaign</span>
              <button onClick={() => setNewCampModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateCampaign}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Campaign Internal Title:</label>
                  <input
                    required
                    placeholder="e.g. Q4 Flash Sale Announcement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Email Subject Line:</label>
                    <input
                      required
                      placeholder="e.g. Exclusive 25% discount for you!"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Target Segment:</label>
                    <select
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    >
                      <option value="Customers">All Customers</option>
                      <option value="Leads">CRM Leads & Prospects</option>
                      <option value="Vendors">Vendors & Suppliers</option>
                    </select>
                  </div>
                </div>

                <div className="o-field">
                  <label>Email Body (HTML / Markdown supported):</label>
                  <textarea
                    rows={4}
                    placeholder="<h1>Special Announcement</h1><p>We are thrilled to unveil...</p>"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewCampModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Save Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
