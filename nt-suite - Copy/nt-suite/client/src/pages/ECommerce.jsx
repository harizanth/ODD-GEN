import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  ShoppingBag, ShoppingCart, Plus, Minus, Trash2, CheckCircle,
  Star, ShieldCheck, Truck, CreditCard, Search
} from 'lucide-react';

export default function ECommerce() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    api.get('/inventory/products').then((res) => {
      setProducts(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
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
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const next = item.qty + delta;
            return next > 0 ? { ...item, qty: next } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      // Create a sales order automatically from web store
      const res = await api.post('/sales/orders', {
        partnerId: 1, // Default web customer
        lines: cart.map(item => ({
          productId: item.id,
          desc: item.name,
          qty: item.qty,
          unitPrice: item.price
        }))
      });
      setOrderSuccess(res);
      setCart([]);
      setCartOpen(false);
    } catch (err) {
      alert('Checkout error: ' + err.message);
    }
  };

  return (
    <div className="min-h-full pb-16 bg-gray-50 dark:bg-gray-900">
      {/* eCommerce Hero Header */}
      <div className="bg-gradient-to-r from-[#714B67] to-[#017E84] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              Online Storefront
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Enterprise eCommerce Portal
            </h1>
            <p className="text-sm text-purple-100 max-w-lg">
              Direct B2B customer storefront connected to live inventory stock and automated sales orders.
            </p>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="bg-white text-[#714B67] hover:bg-gray-100 font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm transition"
          >
            <ShoppingCart size={18} />
            <span>View Cart ({totalItems})</span>
          </button>
        </div>
      </div>

      {/* Store Container */}
      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-6">
        {/* Category Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  category === cat
                    ? 'bg-[#714B67] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#714B67] dark:text-white"
            />
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{prod.category}</span>
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                    In Stock
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5 line-clamp-2">
                  {prod.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {prod.description || 'High-performance enterprise hardware components & accessories.'}
                </p>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-700 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Unit Price</span>
                  <span className="text-lg font-extrabold text-[#714B67] dark:text-purple-400">
                    ₹{prod.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="bg-[#714B67] hover:bg-[#5A3C52] text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer Slide-Over */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <ShoppingCart size={18} className="text-[#714B67]" /> Shopping Cart ({totalItems})
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                  <ShoppingBag size={42} className="mb-2 opacity-30" />
                  <span>Your cart is empty</span>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex-1 pr-3">
                      <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-gray-500 mt-0.5">₹{item.price.toFixed(2)} each</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-gray-700 dark:text-gray-200"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-gray-700 dark:text-gray-200"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90 space-y-3">
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                <span>Subtotal:</span>
                <span className="text-[#714B67] dark:text-purple-400">₹{subtotal.toFixed(2)}</span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-3 bg-[#714B67] hover:bg-[#5A3C52] disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <CreditCard size={18} /> Place Order (₹{subtotal.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Order Confirmed!</h3>
            <p className="text-xs text-gray-500 mb-4">
              Sales order #{orderSuccess.number} has been created and dispatched to the warehouse.
            </p>
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 bg-[#714B67] text-white rounded-xl text-xs font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
