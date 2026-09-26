import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Factory, Plus, CheckCircle, Clock, AlertTriangle, Layers,
  ChevronRight, Play, CheckSquare, Search, ArrowUpDown
} from 'lucide-react';

export default function MRP() {
  const [tab, setTab] = useState('orders'); // 'orders' | 'boms'
  const [orders, setOrders] = useState([]);
  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderModal, setNewOrderModal] = useState(false);
  const [newBomModal, setNewBomModal] = useState(false);

  // Form states
  const [selectedBomId, setSelectedBomId] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [bomProduct, setBomProduct] = useState('');
  const [bomCode, setBomCode] = useState('');
  const [bomComponents, setBomComponents] = useState([{ productId: '', qtyRequired: 1 }]);

  const loadData = () => {
    Promise.all([
      api.get('/mrp/orders'),
      api.get('/mrp/boms'),
      api.get('/inventory/products')
    ]).then(([ordRes, bomRes, prodRes]) => {
      setOrders(ordRes || []);
      setBoms(bomRes || []);
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

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedBomId) return;
    try {
      await api.post('/mrp/orders', {
        bomId: Number(selectedBomId),
        qty: Number(orderQty)
      });
      setNewOrderModal(false);
      setSelectedBomId('');
      setOrderQty(1);
      loadData();
    } catch (err) {
      alert('Error creating order: ' + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/mrp/orders/${orderId}`, { status });
      loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleCreateBom = async (e) => {
    e.preventDefault();
    if (!bomProduct || !bomCode) return;
    try {
      await api.post('/mrp/boms', {
        code: bomCode,
        productId: Number(bomProduct),
        qty: 1,
        components: bomComponents.filter(c => c.productId).map(c => ({
          productId: Number(c.productId),
          qtyRequired: Number(c.qtyRequired)
        }))
      });
      setNewBomModal(false);
      setBomCode('');
      setBomProduct('');
      setBomComponents([{ productId: '', qtyRequired: 1 }]);
      loadData();
    } catch (err) {
      alert('Error creating BOM: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <span className="o-badge o-badge-muted">Draft</span>;
      case 'confirmed':
        return <span className="o-badge o-badge-info">Confirmed</span>;
      case 'in_progress':
        return <span className="o-badge o-badge-warning">In Progress</span>;
      case 'done':
        return <span className="o-badge o-badge-success">Done</span>;
      case 'cancelled':
        return <span className="o-badge o-badge-danger">Cancelled</span>;
      default:
        return <span className="o-badge o-badge-muted">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Factory className="text-[#714B67]" /> Manufacturing & MRP
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage Bills of Materials (BOM), work orders, and assembly scheduling
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'orders' ? (
            <button
              onClick={() => setNewOrderModal(true)}
              className="o-btn o-btn-primary flex items-center gap-1.5"
            >
              <Plus size={16} /> New Manufacturing Order
            </button>
          ) : (
            <button
              onClick={() => setNewBomModal(true)}
              className="o-btn o-btn-primary flex items-center gap-1.5"
            >
              <Plus size={16} /> New Bill of Materials
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="o-tabs">
        <button
          onClick={() => setTab('orders')}
          className={`o-tab ${tab === 'orders' ? 'active' : ''}`}
        >
          Manufacturing Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab('boms')}
          className={`o-tab ${tab === 'boms' ? 'active' : ''}`}
        >
          Bills of Materials ({boms.length})
        </button>
      </div>

      {/* Orders List View */}
      {tab === 'orders' && (
        <div className="o-table-wrap">
          <table className="o-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Finished Product</th>
                <th>BOM Code</th>
                <th>Quantity to Produce</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No manufacturing orders found. Click "New Manufacturing Order" to schedule one.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-semibold text-[#714B67] dark:text-purple-400">
                      {ord.number}
                    </td>
                    <td className="font-medium text-gray-900 dark:text-white">
                      {ord.bom?.product?.name || 'Finished Good'}
                    </td>
                    <td className="text-xs text-gray-500">{ord.bom?.code}</td>
                    <td className="font-semibold">{ord.qty} Units</td>
                    <td className="text-xs text-gray-500">
                      {new Date(ord.scheduledAt).toLocaleDateString()}
                    </td>
                    <td>{getStatusBadge(ord.status)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {ord.status === 'draft' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'confirmed')}
                            className="o-btn o-btn-sm o-btn-teal"
                          >
                            Confirm
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'in_progress')}
                            className="o-btn o-btn-sm bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <Play size={12} /> Start Production
                          </button>
                        )}
                        {ord.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'done')}
                            className="o-btn o-btn-sm o-btn-success"
                          >
                            <CheckSquare size={12} /> Mark as Done
                          </button>
                        )}
                        {ord.status === 'done' && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle size={14} /> Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* BOMs List View */}
      {tab === 'boms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boms.map((bom) => (
            <div key={bom.id} className="o-card space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {bom.code}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {bom.product?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Routing: {bom.routing || 'Standard Assembly Line'}
                  </p>
                </div>
                <span className="o-badge o-badge-teal">{bom.qty} Unit(s)</span>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Layers size={14} /> Required Components:
                </h4>
                <div className="space-y-1.5">
                  {bom.components?.map((comp) => (
                    <div
                      key={comp.id}
                      className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1.5 rounded"
                    >
                      <span className="text-gray-800 dark:text-gray-200">
                        {comp.product?.name || `Product #${comp.productId}`}
                      </span>
                      <span className="font-semibold text-[#714B67] dark:text-purple-400">
                        {comp.qtyRequired} unit(s)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Manufacturing Order Modal */}
      {newOrderModal && (
        <div className="o-modal-overlay">
          <div className="o-modal">
            <div className="o-modal-header">
              <span>Create Manufacturing Order</span>
              <button onClick={() => setNewOrderModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateOrder}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Select Bill of Materials (BOM):</label>
                  <select
                    required
                    value={selectedBomId}
                    onChange={(e) => setSelectedBomId(e.target.value)}
                  >
                    <option value="">-- Choose BOM --</option>
                    {boms.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} — {b.product?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="o-field">
                  <label>Quantity to Produce:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderQty}
                    onChange={(e) => setOrderQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewOrderModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New BOM Modal */}
      {newBomModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-lg">
            <div className="o-modal-header">
              <span>Create Bill of Materials</span>
              <button onClick={() => setNewBomModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateBom}>
              <div className="o-modal-body space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>BOM Reference / Code:</label>
                    <input
                      required
                      placeholder="e.g. BOM-CHAIR-01"
                      value={bomCode}
                      onChange={(e) => setBomCode(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Finished Product:</label>
                    <select
                      required
                      value={bomProduct}
                      onChange={(e) => setBomProduct(e.target.value)}
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Components (Materials):
                    </label>
                    <button
                      type="button"
                      onClick={() => setBomComponents([...bomComponents, { productId: '', qtyRequired: 1 }])}
                      className="text-xs text-[#714B67] hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Component
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {bomComponents.map((comp, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <select
                          required
                          value={comp.productId}
                          onChange={(e) => {
                            const next = [...bomComponents];
                            next[idx].productId = e.target.value;
                            setBomComponents(next);
                          }}
                          className="flex-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-1.5 dark:text-white"
                        >
                          <option value="">-- Choose Component --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          required
                          value={comp.qtyRequired}
                          onChange={(e) => {
                            const next = [...bomComponents];
                            next[idx].qtyRequired = e.target.value;
                            setBomComponents(next);
                          }}
                          className="w-20 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-1.5 text-center dark:text-white"
                          placeholder="Qty"
                        />
                        {bomComponents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setBomComponents(bomComponents.filter((_, i) => i !== idx))}
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
                <button type="button" onClick={() => setNewBomModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Save BOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
