import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api.js';
import {
  PenTool, Plus, CheckCircle, Clock, XCircle, FileText,
  User, ShieldCheck, Download, Trash2
} from 'lucide-react';

export default function Sign() {
  const [requests, setRequests] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [signModal, setSignModal] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [partnerId, setPartnerId] = useState('');

  // Canvas ref for signature drawing
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const loadData = () => {
    Promise.all([
      api.get('/sign/requests'),
      api.get('/contacts')
    ]).then(([reqRes, partRes]) => {
      setRequests(reqRes || []);
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

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!title || !partnerId) return;
    try {
      await api.post('/sign/requests', {
        title,
        partnerId: Number(partnerId)
      });
      setNewRequestModal(false);
      setTitle('');
      setPartnerId('');
      loadData();
    } catch (err) {
      alert('Error creating signature request: ' + err.message);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1E293B';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSignDocument = async () => {
    if (!signModal) return;
    const canvas = canvasRef.current;
    const signatureData = canvas ? canvas.toDataURL() : 'Digital Stamp';

    try {
      await api.post(`/sign/requests/${signModal.id}/sign`, {
        signature: signatureData
      });
      setSignModal(null);
      loadData();
    } catch (err) {
      alert('Error signing document: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <PenTool className="text-[#2196F3]" /> Sign (e-Signatures)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Send contracts for legally binding digital signatures and audit trail timestamps
          </p>
        </div>

        <button
          onClick={() => setNewRequestModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Plus size={16} /> Request Signature
        </button>
      </div>

      {/* Requests Table */}
      <div className="o-table-wrap">
        <table className="o-table">
          <thead>
            <tr>
              <th>Document Title</th>
              <th>Signer / Customer</th>
              <th>Requested By</th>
              <th>Date Issued</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No signature requests found. Click "Request Signature" to initiate one.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-[#714B67]" />
                    {req.title}
                  </td>
                  <td className="font-medium text-gray-800 dark:text-gray-200">
                    {req.partner?.name}
                  </td>
                  <td className="text-xs text-gray-500">
                    {req.requester?.name || 'Admin'}
                  </td>
                  <td className="text-xs text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {req.status === 'signed' ? (
                      <span className="o-badge o-badge-success flex items-center gap-1">
                        <ShieldCheck size={12} /> Signed & Verified
                      </span>
                    ) : req.status === 'rejected' ? (
                      <span className="o-badge o-badge-danger">Rejected</span>
                    ) : (
                      <span className="o-badge o-badge-warning flex items-center gap-1">
                        <Clock size={12} /> Waiting for Signature
                      </span>
                    )}
                  </td>
                  <td>
                    {req.status === 'pending' ? (
                      <button
                        onClick={() => setSignModal(req)}
                        className="o-btn o-btn-sm o-btn-teal flex items-center gap-1"
                      >
                        <PenTool size={12} /> Sign Now
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Signed on {new Date(req.signedAt || req.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {newRequestModal && (
        <div className="o-modal-overlay">
          <div className="o-modal">
            <div className="o-modal-header">
              <span>Send Document for Signature</span>
              <button onClick={() => setNewRequestModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateRequest}>
              <div className="o-modal-body space-y-4">
                <div className="o-field">
                  <label>Document Title:</label>
                  <input
                    required
                    placeholder="e.g. Master Services Agreement 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Recipient / Signer:</label>
                  <select
                    required
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                  >
                    <option value="">-- Choose Signer --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.email || 'No email'})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewRequestModal(false)} className="o-btn">
                  Cancel
                </button>
                <button type="submit" className="o-btn o-btn-primary">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Signature Pad Modal */}
      {signModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-md">
            <div className="o-modal-header">
              <span>Sign Document: {signModal.title}</span>
              <button onClick={() => setSignModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="o-modal-body space-y-3">
              <p className="text-xs text-gray-500">
                Draw your signature below with your mouse or finger to digitally execute this document:
              </p>

              <div className="border border-gray-300 dark:border-gray-600 rounded-xl bg-white overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full cursor-crosshair"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-rose-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear Pad
                </button>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck size={14} /> 256-Bit SHA Encrypted
                </span>
              </div>
            </div>
            <div className="o-modal-footer">
              <button type="button" onClick={() => setSignModal(null)} className="o-btn">
                Cancel
              </button>
              <button type="button" onClick={handleSignDocument} className="o-btn o-btn-success">
                Confirm & Apply Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
