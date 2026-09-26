import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  Package, Plus, AlertTriangle, ArrowUpDown, Layers,
  CheckCircle, Search, Filter, ShoppingCart
} from 'lucide-react';

export default function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [newProdModal, setNewProdModal] = useState(false);
  const [adjustModal, setAdjustModal] = useState(null);

  // Form states
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [cat, setCat] = useState('Furniture');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState(10);
  const [reorder, setReorder] = useState(20);

  // Stock adjustment state
  const [adjustQty, setAdjustQty] = useState(0);

  const loadData = () => {
    api.get('/inventory/products').then((res) => {
      setProducts(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!sku || !name) return;
    try {
      await api.post('/inventory/products', {
        sku,
        name,
        category: cat,
        price: Number(price) || 0,
        cost: Number(cost) || 0,
        stock: Number(stock) || 0,
        reorder: Number(reorder) || 10
      });
      setNewProdModal(false);
      setSku('');
      setName('');
      setPrice('');
      setCost('');
      loadData();
    } catch (err) {
      alert('Error creating product: ' + err.message);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!adjustModal) return;
    try {
      await api.post(`/inventory/products/${adjustModal.id}/adjust`, {
        qty: Number(adjustQty),
        type: 'adjustment'
      });
      setAdjustModal(null);
      setAdjustQty(0);
      loadData();
    } catch (err) {
      alert('Error adjusting stock: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-[#D35400]" /> Inventory & Warehousing
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time stock counts, product catalog pricing, safety reorder thresholds, and inventory moves
          </p>
        </div>

        <button
          onClick={() => setNewProdModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                category === c
                  ? 'bg-[#714B67] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#714B67] dark:text-white"
          />
        </div>
      </div>

      {/* Product Stock Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sales Price</th>
              <th>Cost</th>
              <th>On-Hand Stock</th>
              <th>Reorder Point</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => {
                const isLow = prod.stock <= prod.reorder;
                return (
                  <tr key={prod.id}>
                    <td className="font-mono text-xs font-bold text-gray-500">
                      {prod.sku}
                    </td>
                    <td className="font-semibold text-gray-900 dark:text-white">
                      {prod.name}
                    </td>
                    <td>
                      <span className="o-badge o-badge-teal">{prod.category}</span>
                    </td>
                    <td className="font-bold text-[#714B67] dark:text-purple-400">
                      ₹{prod.price.toFixed(2)}
                    </td>
                    <td className="text-xs text-gray-500">
                      ₹{prod.cost.toFixed(2)}
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                        isLow ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {isLow && <AlertTriangle size={13} />}
                        {prod.stock} {prod.uom || 'Units'}
                      </span>
                    </td>
                    <td className="text-xs text-gray-500">
                      {prod.reorder} Units
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustModal(prod);
                            setAdjustQty(prod.stock);
                          }}
                          className="o-btn o-btn-sm o-btn-teal flex items-center gap-1"
                        >
                          <ArrowUpDown size={12} /> Adjust Stock
                        </button>
                        {isLow && (
                          <button
                            onClick={() => navigate('/purchase')}
                            className="o-btn o-btn-sm o-btn-primary flex items-center gap-1 text-[11px]"
                            title="Create Vendor Purchase Order"
                          >
                            <ShoppingCart size={11} /> Reorder →
                          </button>
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

      {/* New Product Modal */}
      {newProdModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-lg">
            <div className="o-modal-header">
              <span>Add New Product</span>
              <button onClick={() => setNewProdModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div className="o-modal-body space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>SKU / Barcode:</label>
                    <input
                      required
                      placeholder="e.g. FURN-009"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Category:</label>
                    <select
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                </div>

                <div className="o-field">
                  <label>Product Name:</label>
                  <input
                    required
                    placeholder="e.g. Ergonomic Standing Desk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Sales Price (₹):</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 450"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Cost Price (₹):</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 240"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-field">
                    <label>Initial Stock:</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Reorder Safety Point:</label>
                    <input
                      type="number"
                      value={reorder}
                      onChange={(e) => setReorder(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewProdModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Adjust Stock: {adjustModal.name}</span>
              <button onClick={() => setAdjustModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAdjustStock}>
              <div className="o-modal-body space-y-3">
                <div className="text-xs text-gray-500">
                  Current On-Hand Quantity: <strong className="text-gray-900 dark:text-white">{adjustModal.stock}</strong>
                </div>

                <div className="o-field">
                  <label>Counted / New Physical Quantity:</label>
                  <input
                    type="number"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setAdjustModal(null)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-teal">Apply Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
