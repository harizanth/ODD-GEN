import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Zap, MapPin, User, Clock, CheckCircle, Plus, Calendar,
  AlertCircle, ChevronRight, CheckSquare, Search
} from 'lucide-react';

export default function FieldService() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderModal, setNewOrderModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('normal');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/fieldservice/orders'),
      api.get('/contacts'),
      api.get('/hr/employees')
    ]).then(([ordRes, partRes, empRes]) => {
      setOrders(ordRes || []);
      setPartners(partRes || []);
      setUsers(empRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!title || !partnerId) return;
    try {
      await api.post('/fieldservice/orders', {
        title,
        partnerId: Number(partnerId),
        technicianId: technicianId ? Number(technicianId) : null,
        location,
        priority,
        notes
      });
      setNewOrderModal(false);
      setTitle('');
      setPartnerId('');
      setTechnicianId('');
      setLocation('');
      setNotes('');
      loadData();
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/fieldservice/orders/${orderId}`, { status });
      loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'urgent':
        return <span className="o-badge o-badge-danger">Urgent</span>;
      case 'high':
        return <span className="o-badge o-badge-warning">High</span>;
      default:
        return <span className="o-badge o-badge-muted">{p}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="text-[#E67E22]" /> Field Service & Onsite Dispatch
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Coordinate onsite technician work orders, map routing, and client sign-offs
          </p>
        </div>

        <button
          onClick={() => setNewOrderModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Work Order
        </button>
      </div>

      {/* Orders Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((ord) => (
          <div key={ord.id} className="o-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-[#714B67] dark:text-purple-400">
                  {ord.number}
                </span>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(ord.priority)}
                  <span className={`o-badge ${
                    ord.status === 'completed'
                      ? 'o-badge-success'
                      : ord.status === 'in_progress'
                      ? 'o-badge-warning'
                      : 'o-badge-info'
                  }`}>
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {ord.title}
              </h3>

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-[#017E84]" />
                  <span>Customer: <strong className="text-gray-900 dark:text-white">{ord.partner?.name}</strong></span>
                </div>
                {ord.location && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin size={14} className="text-rose-500" />
                    <span className="truncate">{ord.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock size={14} className="text-amber-500" />
                  <span>Assigned: {ord.technician?.name || 'Unassigned'}</span>
                </div>
              </div>

              {ord.notes && (
                <p className="mt-3 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-gray-600 dark:text-gray-300">
                  {ord.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                {ord.scheduledFor ? new Date(ord.scheduledFor).toLocaleDateString() : 'Immediate'}
              </span>

              <div className="flex items-center gap-1.5">
                {ord.status === 'new' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'scheduled')}
                    className="o-btn o-btn-sm o-btn-teal"
                  >
                    Schedule
                  </button>
                )}
                {ord.status === 'scheduled' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'in_progress')}
                    className="o-btn o-btn-sm bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Start Work
                  </button>
                )}
                {ord.status === 'in_progress' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'completed')}
                    className="o-btn o-btn-sm o-btn-success"
                  >
                    <CheckCircle size={12} /> Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Work Order Modal */}
      {newOrderModal && (
        <div className="o-modal-overlay">
          <div className="o-modal">
            <div className="o-modal-header">
              <span>Create Field Service Order</span>
              <button onClick={() => setNewOrderModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateOrder}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Order Title / Task Summary:</label>
                  <input
                    required
                    placeholder="e.g. Server rack installation & wiring"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Customer / Partner:</label>
                    <select
                      required
                      value={partnerId}
                      onChange={(e) => setPartnerId(e.target.value)}
                    >
                      <option value="">-- Choose Client --</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="o-field">
                    <label>Priority:</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="o-field">
                  <label>Onsite Address / Location:</label>
                  <input
                    placeholder="e.g. 101 Innovation Park, Floor 3"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Work Notes & Instructions:</label>
                  <textarea
                    rows={3}
                    placeholder="Specific access codes or parts required..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewOrderModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
