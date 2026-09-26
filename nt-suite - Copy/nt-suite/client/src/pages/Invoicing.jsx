import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  FileText, Plus, CheckCircle, Clock, AlertCircle, CreditCard,
  Banknote, ArrowUpRight, DollarSign, Calendar
} from 'lucide-react';

export default function Invoicing() {
  const [invoices, setInvoices] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInvModal, setNewInvModal] = useState(false);
  const [payModal, setPayModal] = useState(null);

  // Form states
  const [partnerId, setPartnerId] = useState('');
  const [type, setType] = useState('out_invoice'); // 'out_invoice' | 'in_invoice'
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);

  // Payment form states
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bank');

  const loadData = () => {
    Promise.all([
      api.get('/invoicing/invoices'),
      api.get('/contacts')
    ]).then(([invRes, partRes]) => {
      setInvoices(invRes || []);
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

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!partnerId || !amount) return;
    try {
      await api.post('/invoicing/invoices', {
        partnerId: Number(partnerId),
        type,
        amount: Number(amount),
        dueDate: new Date(dueDate)
      });
      setNewInvModal(false);
      setPartnerId('');
      setAmount('');
      loadData();
    } catch (err) {
      alert('Error creating invoice: ' + err.message);
    }
  };

  const handleRegisterPayment = async (e) => {
    e.preventDefault();
    if (!payModal) return;
    try {
      await api.post(`/invoicing/invoices/${payModal.id}/payments`, {
        amount: Number(payAmount) || payModal.amount,
        method: payMethod
      });
      setPayModal(null);
      setPayAmount('');
      loadData();
    } catch (err) {
      alert('Error registering payment: ' + err.message);
    }
  };

  const totalReceivables = invoices
    .filter(i => i.type === 'out_invoice' && i.status !== 'paid')
    .reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices
    .filter(i => i.type === 'out_invoice' && i.status === 'paid')
    .reduce((s, i) => s + (i.amount || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-[#017E84]" /> Invoicing & Accounting
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Customer invoices, vendor bills, bank reconciliations, and instant payment registration
          </p>
        </div>

        <button
          onClick={() => setNewInvModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Customer Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="o-stat">
          <span className="o-stat-label">Outstanding Receivables</span>
          <span className="o-stat-value text-[#714B67] dark:text-purple-400">
            ₹{totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="o-stat-sub">Pending customer clearance</span>
        </div>

        <div className="o-stat">
          <span className="o-stat-label">Collected Payments</span>
          <span className="o-stat-value text-emerald-600">
            ₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="o-stat-sub text-emerald-600 font-medium">Fully settled invoices</span>
        </div>

        <div className="o-stat">
          <span className="o-stat-label">Overdue Alerts</span>
          <span className="o-stat-value text-rose-600">
            {overdueCount} Invoices
          </span>
          <span className="o-stat-sub text-rose-500">Requires follow-up communication</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer / Vendor</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No invoices found. Click "New Customer Invoice" to bill a customer.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-semibold text-[#714B67] dark:text-purple-400">
                    {inv.number}
                  </td>
                  <td className="font-medium text-gray-900 dark:text-white">
                    {inv.partner?.name}
                  </td>
                  <td>
                    <span className="o-badge o-badge-muted">
                      {inv.type === 'out_invoice' ? 'Customer Invoice' : 'Vendor Bill'}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                  <td className="font-bold text-gray-900 dark:text-white">
                    ₹{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    {inv.status === 'paid' && <span className="o-badge o-badge-success">Paid</span>}
                    {inv.status === 'unpaid' && <span className="o-badge o-badge-warning">Unpaid</span>}
                    {inv.status === 'overdue' && <span className="o-badge o-badge-danger">Overdue</span>}
                    {inv.status === 'draft' && <span className="o-badge o-badge-muted">Draft</span>}
                  </td>
                  <td>
                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => {
                          setPayModal(inv);
                          setPayAmount(String(inv.amount));
                        }}
                        className="o-btn o-btn-sm o-btn-teal flex items-center gap-1"
                      >
                        <CreditCard size={12} /> Register Payment
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle size={14} /> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {newInvModal && (
        <div className="o-modal-overlay">
          <div className="o-modal">
            <div className="o-modal-header">
              <span>Create Customer Invoice</span>
              <button onClick={() => setNewInvModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Customer / Partner:</label>
                  <select
                    required
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                  >
                    <option value="">-- Choose Customer --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Invoice Type:</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="out_invoice">Customer Invoice (Receivable)</option>
                      <option value="in_invoice">Vendor Bill (Payable)</option>
                    </select>
                  </div>

                  <div className="o-field">
                    <label>Invoice Amount (₹):</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="o-field">
                  <label>Due Date:</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewInvModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Post Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Payment Modal */}
      {payModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Register Payment for {payModal.number}</span>
              <button onClick={() => setPayModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleRegisterPayment}>
              <div className="o-modal-body space-y-3">
                <div className="text-xs text-gray-500">
                  Customer: <strong className="text-gray-900 dark:text-white">{payModal.partner?.name}</strong>
                </div>

                <div className="o-field">
                  <label>Payment Amount (₹):</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Payment Journal / Method:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                  >
                    <option value="bank">Bank Wire Transfer</option>
                    <option value="card">Credit Card (Stripe)</option>
                    <option value="cash">Cash in Register</option>
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setPayModal(null)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-success">Validate Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
