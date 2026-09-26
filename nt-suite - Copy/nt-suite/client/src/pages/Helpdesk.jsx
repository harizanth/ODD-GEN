import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  Headphones, Plus, CheckCircle, Clock, AlertCircle,
  User, MessageSquare, ShieldCheck, Zap
} from 'lucide-react';

export default function Helpdesk() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [partners, setPartners] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicketModal, setNewTicketModal] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [priority, setPriority] = useState('normal');
  const [assigneeId, setAssigneeId] = useState('');
  const [description, setDescription] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/helpdesk/tickets'),
      api.get('/contacts'),
      api.get('/hr/employees')
    ]).then(([tickRes, partRes, empRes]) => {
      setTickets(tickRes || []);
      setPartners(partRes || []);
      setEmployees(empRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject) return;
    try {
      await api.post('/helpdesk/tickets', {
        subject,
        partnerId: partnerId ? Number(partnerId) : null,
        priority,
        assigneeId: assigneeId ? Number(assigneeId) : null,
        description
      });
      setNewTicketModal(false);
      setSubject('');
      setPartnerId('');
      setDescription('');
      loadData();
    } catch (err) {
      alert('Error creating ticket: ' + err.message);
    }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      await api.put(`/helpdesk/tickets/${ticketId}`, { status });
      loadData();
    } catch (err) {
      alert('Error updating ticket: ' + err.message);
    }
  };

  const handleDispatchFieldService = async (ticket) => {
    try {
      await api.post('/fieldservice/orders', {
        title: `Dispatch for Ticket #${ticket.id}: ${ticket.subject}`,
        partnerId: ticket.partnerId || 1,
        priority: ticket.priority === 'urgent' || ticket.priority === 'high' ? 'high' : 'normal',
        notes: `Escalated from Helpdesk Ticket #${ticket.id}: ${ticket.description || ''}`,
      });
      navigate('/fieldservice');
    } catch (err) {
      alert('Error dispatching field service: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Headphones className="text-[#00A09D]" /> Helpdesk Support Tickets
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track customer inquiries, SLA priorities, issue resolution workflows, and ticket assignees
          </p>
        </div>

        <button
          onClick={() => setNewTicketModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Support Ticket
        </button>
      </div>

      {/* Tickets Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>Ticket Subject</th>
              <th>Customer</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Date Opened</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No support tickets found. Click "New Support Ticket" to log a customer issue.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id}>
                  <td className="font-semibold text-gray-900 dark:text-white">
                    <div>{t.subject}</div>
                    {t.description && (
                      <div className="text-[11px] text-gray-400 font-normal line-clamp-1">{t.description}</div>
                    )}
                  </td>
                  <td className="font-medium text-gray-800 dark:text-gray-200">
                    {t.partner?.name || 'Walk-in / Direct'}
                  </td>
                  <td>
                    {t.priority === 'urgent' && <span className="o-badge o-badge-danger">Urgent SLA</span>}
                    {t.priority === 'high' && <span className="o-badge o-badge-warning">High</span>}
                    {t.priority === 'normal' && <span className="o-badge o-badge-info">Normal</span>}
                    {t.priority === 'low' && <span className="o-badge o-badge-muted">Low</span>}
                  </td>
                  <td className="text-xs text-gray-600 dark:text-gray-300">
                    {t.assignee?.name || 'Unassigned'}
                  </td>
                  <td className="text-xs text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {t.status === 'open' && <span className="o-badge o-badge-warning">Open</span>}
                    {t.status === 'pending' && <span className="o-badge o-badge-info">Pending Client</span>}
                    {t.status === 'resolved' && <span className="o-badge o-badge-success">Resolved</span>}
                    {t.status === 'closed' && <span className="o-badge o-badge-muted">Closed</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {t.status !== 'resolved' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(t.id, 'resolved')}
                            className="o-btn o-btn-sm o-btn-teal flex items-center gap-1"
                          >
                            <CheckCircle size={12} /> Resolve
                          </button>
                          <button
                            onClick={() => handleDispatchFieldService(t)}
                            className="o-btn o-btn-sm o-btn-secondary flex items-center gap-1 text-[11px]"
                            title="Dispatch Onsite Field Technician"
                          >
                            <Zap size={11} className="text-amber-500" /> Dispatch Tech
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Ticket Modal */}
      {newTicketModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-lg">
            <div className="o-modal-header">
              <span>Create Helpdesk Ticket</span>
              <button onClick={() => setNewTicketModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Ticket Subject:</label>
                  <input
                    required
                    placeholder="e.g. Cannot connect to VPN gateway"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Customer / Partner:</label>
                    <select
                      value={partnerId}
                      onChange={(e) => setPartnerId(e.target.value)}
                    >
                      <option value="">-- Choose Client --</option>
                      {partners.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="o-field">
                    <label>Priority SLA:</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low (48h)</option>
                      <option value="normal">Normal (24h)</option>
                      <option value="high">High (4h)</option>
                      <option value="urgent">Urgent (1h critical)</option>
                    </select>
                  </div>
                </div>

                <div className="o-field">
                  <label>Assignee:</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.userId || emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="o-field">
                  <label>Issue Description & Steps to Reproduce:</label>
                  <textarea
                    rows={3}
                    placeholder="Details about error messages, browser version, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewTicketModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
