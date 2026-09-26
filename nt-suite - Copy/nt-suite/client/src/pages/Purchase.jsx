import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  ShoppingCart, Plus, CheckCircle, Package, Truck,
  FileText, ArrowDownRight
} from 'lucide-react';

export default function Purchase() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderModal, setNewOrderModal] = useState(false);

  // Form states
  const [partnerId, setPartnerId] = useState('');
  const [lines, setLines] = useState([{ productId: '', desc: '', qty: 10, unitCost: 0 }]);

  const loadData = () => {
    Promise.all([
      api.get('/purchase/orders'),
      api.get('/contacts'),
      api.get('/inventory/products')
    ]).then(([ordRes, partRes, prodRes]) => {
      setOrders(ordRes || []);
      setPartners((partRes || []).filter(p => p.type === 'vendor' || p.type === 'both' || true));
      setProducts(prodRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductSelect = (index, prodId) => {
    const prod = products.find(p => p.id === Number(prodId));
    const next = [...lines];
    next[index].productId = prodId;
    next[index].desc = prod ? prod.name : '';
    next[index].unitCost = prod ? prod.cost : 0;
    setLines(next);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!partnerId) return;
    try {
      await api.post('/purchase/orders', {
        partnerId: Number(partnerId),
        lines: lines.map(l => ({
          productId: l.productId ? Number(l.productId) : null,
          desc: l.desc,
          qty: Number(l.qty),
          unitCost: Number(l.unitCost)
        }))
      });
      setNewOrderModal(false);
      setPartnerId('');
      setLines([{ productId: '', desc: '', qty: 10, unitCost: 0 }]);
      loadData();
    } catch (err) {
      alert('Error creating PO: ' + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/purchase/orders/${orderId}`, { status });
      loadData();
    } catch (err) {
      alert('Error updating PO: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-[#017E84]" /> Purchase Orders (Vendor RFQs)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Procure raw materials, track vendor delivery receipts, and manage vendor bills
          </p>
        </div>

        <button
          onClick={() => setNewOrderModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Purchase Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>PO #</th>
              <th>Vendor</th>
              <th>Order Date</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No purchase orders found. Click "New Purchase Order" to begin.
                </td>
              </tr>
            ) : (
              orders.map((ord) => {
                const total = ord.amountTotal || ord.lines?.reduce((s, l) => s + (l.qty * l.unitCost), 0) || 0;
                return (
                  <tr key={ord.id}>
                    <td className="font-semibold text-[#017E84] dark:text-teal-400">
                      {ord.number}
                    </td>
                    <td className="font-medium text-gray-900 dark:text-white">
                      {ord.partner?.name}
                    </td>
                    <td className="text-xs text-gray-500">
                      {new Date(ord.orderDate).toLocaleDateString()}
                    </td>
                    <td className="font-bold text-gray-900 dark:text-white">
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      {ord.status === 'confirmed' && <span className="o-badge o-badge-info">Confirmed</span>}
                      {ord.status === 'draft' && <span className="o-badge o-badge-muted">RFQ Draft</span>}
                      {ord.status === 'received' && <span className="o-badge o-badge-success">Products Received</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {ord.status === 'draft' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'confirmed')}
                            className="o-btn o-btn-sm o-btn-teal"
                          >
                            Confirm Order
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'received')}
                            className="o-btn o-btn-sm o-btn-success flex items-center gap-1"
                          >
                            <Package size={12} /> Receive Products
                          </button>
                        )}
                        {ord.status === 'received' && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle size={14} /> Stock Updated
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New PO Modal */}
      {newOrderModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-xl">
            <div className="o-modal-header">
              <span>Create Purchase Order</span>
              <button onClick={() => setNewOrderModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateOrder}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Select Vendor / Supplier:</label>
                  <select
                    required
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                  >
                    <option value="">-- Choose Vendor --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city || 'Supplier'})</option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Product Lines:
                    </label>
                    <button
                      type="button"
                      onClick={() => setLines([...lines, { productId: '', desc: '', qty: 10, unitCost: 0 }])}
                      className="text-xs text-[#017E84] hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {lines.map((line, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                        <select
                          value={line.productId}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="flex-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-1.5 dark:text-white"
                        >
                          <option value="">-- Custom Item --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} (Cost: ₹{p.cost})</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="Description"
                          value={line.desc}
                          onChange={(e) => {
                            const next = [...lines];
                            next[idx].desc = e.target.value;
                            setLines(next);
                          }}
                          className="flex-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-1.5 dark:text-white"
                        />

                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={line.qty}
                          onChange={(e) => {
                            const next = [...lines];
                            next[idx].qty = e.target.value;
                            setLines(next);
                          }}
                          className="w-14 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-1.5 text-center dark:text-white"
                        />

                        <input
                          type="number"
                          placeholder="Unit Cost"
                          value={line.unitCost}
                          onChange={(e) => {
                            const next = [...lines];
                            next[idx].unitCost = e.target.value;
                            setLines(next);
                          }}
                          className="w-20 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-1.5 text-right dark:text-white"
                        />

                        {lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                            className="text-rose-500 text-xs px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewOrderModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-teal">Send PO to Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
