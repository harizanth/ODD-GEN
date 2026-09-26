import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Store, ShoppingCart, Trash2, Plus, Minus, CreditCard,
  Banknote, Receipt, CheckCircle, Search
} from 'lucide-react';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('card');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/inventory/products'),
      api.get('/contacts')
    ]).then(([prodRes, partRes]) => {
      setProducts(prodRes || []);
      setPartners(partRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedPartner(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const orderPayload = {
        partnerId: selectedPartner?.id || null,
        paymentMode,
        amountTotal: total,
        lines: cart.map(item => ({
          productId: item.id,
          qty: item.qty,
          unitPrice: item.price
        }))
      };

      const res = await api.post('/pos/orders', orderPayload);
      setReceipt({
        ...res,
        cart: [...cart],
        subtotal,
        tax,
        total,
        date: new Date().toLocaleString(),
        customer: selectedPartner?.name || 'Walk-in Customer'
      });
      setCart([]);
      setPaymentModal(false);
    } catch (err) {
      alert('Checkout error: ' + err.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-var(--topbar-h))] bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-3">
        {/* Category Selector & Search */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  category === cat
                    ? 'bg-[#714B67] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#714B67] dark:text-white"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              onClick={() => addToCart(prod)}
              className="o-card p-3.5 cursor-pointer flex flex-col justify-between hover:border-[#714B67] hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-start mb-1 text-[11px]">
                  <span className="font-semibold text-gray-400">{prod.sku}</span>
                  <span className="o-badge o-badge-teal text-[10px]">{prod.stock} in stock</span>
                </div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">
                  {prod.name}
                </h4>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold text-[#714B67] dark:text-purple-400">
                  ₹{prod.price.toFixed(2)}
                </span>
                <span className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[#714B67] flex items-center justify-center font-bold">
                  <Plus size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart Register */}
      <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/80">
          <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-white">
            <Store size={16} className="text-[#714B67]" />
            <span>Cashier Register</span>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium">
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>

        {/* Customer Selector */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <label className="text-[11px] text-gray-500 font-semibold block mb-1">Customer / Partner:</label>
          <select
            value={selectedPartner?.id || ''}
            onChange={e => {
              const p = partners.find(part => part.id === Number(e.target.value));
              setSelectedPartner(p || null);
            }}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1.5 text-xs font-medium"
          >
            <option value="">Walk-in Customer</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.company || 'Individual'})</option>
            ))}
          </select>
        </div>

        {/* Cart Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs text-center">
              <ShoppingCart size={36} className="mb-2 opacity-40" />
              <div>Cart is empty</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Click products to add to cart</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center text-xs">
                <div className="flex-1 pr-2">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-500">₹{item.price.toFixed(2)} × {item.qty} = <span className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.qty).toFixed(2)}</span></div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <Plus size={12} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-rose-500 hover:bg-rose-50 rounded ml-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Pay Action */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Taxes (5% GST):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total:</span>
            <span className="text-[#714B67] dark:text-purple-400">₹{total.toFixed(2)}</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => setPaymentModal(true)}
            className="w-full o-btn o-btn-primary py-2.5 text-xs font-bold justify-center mt-2 disabled:opacity-50"
          >
            Process Payment
          </button>
        </div>
      </div>

      {/* Payment Tender Modal */}
      {paymentModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Select Payment Method</span>
              <button onClick={() => setPaymentModal(false)}>✕</button>
            </div>
            <div className="o-modal-body space-y-4">
              <div className="text-center py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-400 uppercase font-semibold">Total Due</div>
                <div className="text-3xl font-extrabold text-[#714B67] dark:text-purple-400">₹{total.toFixed(2)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMode('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    paymentMode === 'card'
                      ? 'border-[#714B67] bg-purple-50 dark:bg-purple-950/30 text-[#714B67] font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="text-xs font-semibold">Credit / Debit</span>
                </button>
                <button
                  onClick={() => setPaymentMode('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    paymentMode === 'cash'
                      ? 'border-[#714B67] bg-purple-50 dark:bg-purple-950/30 text-[#714B67] font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600'
                  }`}
                >
                  <Banknote size={20} />
                  <span className="text-xs font-semibold">Cash Tender</span>
                </button>
              </div>
            </div>
            <div className="o-modal-footer">
              <button onClick={() => setPaymentModal(false)} className="o-btn">
                Cancel
              </button>
              <button onClick={handleCheckout} className="o-btn o-btn-primary">
                Validate & Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receipt && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl space-y-4 text-xs font-sans">
              <div className="text-center pb-3 border-b border-dashed border-gray-300">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">ODD GEN Retail Store</h3>
                <div className="text-[11px] text-gray-400">Order Ref: #{receipt.number || 'POS-2026'}</div>
                <div className="text-[11px] text-gray-400">{receipt.date}</div>
              </div>

              <div className="space-y-1 py-2 border-b border-dashed border-gray-300">
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Customer:</span>
                  <span>{receipt.customer}</span>
                </div>
                {receipt.cart?.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{item.name} × {item.qty}</span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span>₹{receipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (5%):</span>
                  <span>₹{receipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-1">
                  <span>Total Paid ({receipt.paymentMode?.toUpperCase()}):</span>
                  <span className="text-[#714B67] dark:text-purple-400">₹{receipt.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setReceipt(null)}
                className="w-full o-btn o-btn-primary py-2 text-center justify-center font-bold"
              >
                New Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
