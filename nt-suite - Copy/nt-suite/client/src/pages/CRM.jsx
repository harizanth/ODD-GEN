import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  Handshake, Plus, LayoutGrid, List, User, DollarSign,
  TrendingUp, CheckCircle, XCircle, ArrowRight
} from 'lucide-react';

const STAGES = [
  { id: 'new', label: 'New', color: '#6C757D' },
  { id: 'qualified', label: 'Qualified', color: '#714B67' },
  { id: 'proposal', label: 'Proposal', color: '#E67E22' },
  { id: 'won', label: 'Won', color: '#28A745' },
  { id: 'lost', label: 'Lost', color: '#DC3545' },
];

export default function CRM() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [partners, setPartners] = useState([]);
  const [view, setView] = useState('kanban');
  const [loading, setLoading] = useState(true);
  const [newLeadModal, setNewLeadModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [value, setValue] = useState('');
  const [source, setSource] = useState('Website');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/crm/leads'),
      api.get('/contacts')
    ]).then(([leadRes, partRes]) => {
      setLeads(leadRes || []);
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

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.post('/crm/leads', {
        name,
        partnerId: partnerId ? Number(partnerId) : null,
        value: Number(value) || 0,
        source,
        notes
      });
      setNewLeadModal(false);
      setName('');
      setPartnerId('');
      setValue('');
      setNotes('');
      loadData();
    } catch (err) {
      alert('Error creating lead: ' + err.message);
    }
  };

  const handleMoveStage = async (leadId, newStage) => {
    try {
      await api.put(`/crm/leads/${leadId}`, { stage: newStage });
      loadData();
    } catch (err) {
      alert('Error updating stage: ' + err.message);
    }
  };

  const handleConvertToSalesOrder = async (leadId) => {
    try {
      const res = await api.post(`/crm/leads/${leadId}/convert`);
      loadData();
      navigate('/sales');
    } catch (err) {
      alert('Error converting lead: ' + err.message);
    }
  };

  const totalPipeline = leads.filter(l => l.stage !== 'lost').reduce((sum, l) => sum + (l.value || 0), 0);
  const wonTotal = leads.filter(l => l.stage === 'won').reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
            CRM Pipeline
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Total Pipeline: <strong className="text-gray-900 dark:text-white">₹{totalPipeline.toLocaleString()}</strong> | Won: <strong className="text-emerald-600">₹{wonTotal.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg flex items-center bg-white dark:bg-gray-800 overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`p-2 ${view === 'kanban' ? 'bg-gray-100 dark:bg-gray-700 text-[#714B67] dark:text-purple-400' : 'text-gray-500'}`}
              title="Kanban View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-[#714B67] dark:text-purple-400' : 'text-gray-500'}`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={() => setNewLeadModal(true)}
            className="o-btn o-btn-primary flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="o-kanban">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter(l => l.stage === stage.id);
            const stageTotal = stageLeads.reduce((s, l) => s + (l.value || 0), 0);

            return (
              <div key={stage.id} className="o-kanban-col">
                <div className="o-kanban-col-header justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span>{stage.label}</span>
                  </div>
                  <span className="count">{stageLeads.length}</span>
                </div>

                <div className="space-y-2">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="o-kanban-card space-y-2">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {lead.name}
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#714B67] dark:text-purple-400">
                          ₹{lead.value?.toLocaleString()}
                        </span>
                        <span className="o-badge o-badge-muted text-[10px]">{lead.source || 'Direct'}</span>
                      </div>

                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <User size={12} /> {lead.partner?.name || lead.company || 'Private Lead'}
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                        <select
                          value={lead.stage}
                          onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-xs"
                        >
                          {STAGES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>

                        {lead.stage === 'won' && (
                          <button
                            onClick={() => handleConvertToSalesOrder(lead.id)}
                            className="text-[#714B67] dark:text-purple-300 font-semibold hover:underline text-[11px] flex items-center gap-1"
                          >
                            <span>Convert to SO</span> <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="o-table-wrap">
          <table className="o-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Client / Partner</th>
                <th>Expected Value</th>
                <th>Lead Source</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="font-semibold text-gray-900 dark:text-white">{lead.name}</td>
                  <td>{lead.partner?.name || lead.company || '—'}</td>
                  <td className="font-bold text-[#714B67] dark:text-purple-400">₹{lead.value?.toLocaleString()}</td>
                  <td><span className="o-badge o-badge-muted">{lead.source}</span></td>
                  <td>
                    <select
                      value={lead.stage}
                      onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs"
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {lead.stage === 'won' ? (
                      <button onClick={() => handleConvertToSalesOrder(lead.id)} className="o-btn o-btn-sm o-btn-success flex items-center gap-1">
                        <span>Convert to SO</span> <ArrowRight size={12} />
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Lead Modal */}
      {newLeadModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-md">
            <div className="o-modal-header">
              <span>Create Opportunity</span>
              <button onClick={() => setNewLeadModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateLead}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Opportunity Title</label>
                  <input
                    required
                    placeholder="e.g. Enterprise Modernization"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Customer / Partner</label>
                    <select
                      value={partnerId}
                      onChange={(e) => setPartnerId(e.target.value)}
                    >
                      <option value="">-- Select Client --</option>
                      {partners.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="o-field">
                    <label>Expected Value (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="o-field">
                  <label>Source Channel</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Outbound">Outbound Sales</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewLeadModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
