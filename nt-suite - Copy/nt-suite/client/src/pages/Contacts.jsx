import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  Users, Plus, Mail, Phone, MapPin, Building,
  Search, ExternalLink, ShieldCheck, Tag, ShoppingCart, Handshake, FileText, Headphones
} from 'lucide-react';

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newContactModal, setNewContactModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('customer');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [tags, setTags] = useState('');

  const loadData = () => {
    api.get('/contacts').then((res) => {
      setContacts(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredContacts = contacts.filter(c => {
    const matchType = filterType === 'all' || c.type === filterType;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
                        (c.city && c.city.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const handleCreateContact = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.post('/contacts', {
        name,
        company,
        email,
        phone,
        type,
        city,
        country,
        tags
      });
      setNewContactModal(false);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setCity('');
      setTags('');
      loadData();
    } catch (err) {
      alert('Error saving contact: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-[#2980B9]" /> Unified Contacts Hub (res.partner)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Centralized address book connecting customers, vendors, opportunities, invoices, and contracts
          </p>
        </div>

        <button
          onClick={() => setNewContactModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Contact
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {['all', 'customer', 'vendor'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                filterType === t
                  ? 'bg-[#714B67] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All Partners' : `${t}s`}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners by name, company, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#714B67] dark:text-white"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredContacts.map((c) => (
          <div key={c.id} className="o-card flex flex-col justify-between p-5 space-y-3">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#714B67] to-[#017E84] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  {c.name.charAt(0)}
                </div>
                <span className={`o-badge ${c.type === 'vendor' ? 'o-badge-info' : 'o-badge-teal'}`}>
                  {c.type}
                </span>
              </div>

              <h3 className="font-bold text-sm text-gray-900 dark:text-white">{c.name}</h3>
              {c.company && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <Building size={12} /> {c.company}
                </p>
              )}

              <div className="space-y-1 mt-3 text-xs text-gray-500">
                {c.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="text-[#714B67]" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-emerald-500" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.city && (
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <MapPin size={12} />
                    <span>{c.city}, {c.country}</span>
                  </div>
                )}
              </div>
            </div>

            {c.tags && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-1">
                {c.tags.split(',').map((tag, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Connected Workflows */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-1 text-[11px]">
              <span className="text-gray-400 text-[10px] font-medium">Connected:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/sales')}
                  className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-[#714B67] dark:text-purple-300 hover:bg-purple-100 flex items-center gap-0.5 text-[10px] font-medium transition"
                  title="Create Sales Order"
                >
                  <ShoppingCart size={10} /> SO
                </button>
                <button
                  onClick={() => navigate('/crm')}
                  className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 flex items-center gap-0.5 text-[10px] font-medium transition"
                  title="Create Opportunity"
                >
                  <Handshake size={10} /> Deal
                </button>
                <button
                  onClick={() => navigate('/invoicing')}
                  className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 flex items-center gap-0.5 text-[10px] font-medium transition"
                  title="Bill Customer"
                >
                  <FileText size={10} /> Bill
                </button>
                <button
                  onClick={() => navigate('/helpdesk')}
                  className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-0.5 text-[10px] font-medium transition"
                  title="Create Support Ticket"
                >
                  <Headphones size={10} /> Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Contact Modal */}
      {newContactModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-lg">
            <div className="o-modal-header">
              <span>Create Contact Partner</span>
              <button onClick={() => setNewContactModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateContact}>
              <div className="o-modal-body space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Contact Name / Title:</label>
                    <input
                      required
                      placeholder="e.g. Apex Dynamics Ltd."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Company / Organization:</label>
                    <input
                      placeholder="e.g. Apex Group"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Email Address:</label>
                    <input
                      type="email"
                      placeholder="contact@apexdynamics.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Phone Number:</label>
                    <input
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="o-field">
                    <label>Relationship Type:</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor / Supplier</option>
                      <option value="both">Both (Customer & Vendor)</option>
                    </select>
                  </div>
                  <div className="o-field">
                    <label>City:</label>
                    <input
                      placeholder="e.g. Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Country:</label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="o-field">
                  <label>Tags (Comma separated):</label>
                  <input
                    placeholder="e.g. saas, vip, enterprise"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewContactModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 