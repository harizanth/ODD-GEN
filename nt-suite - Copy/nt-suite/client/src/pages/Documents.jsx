import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  Files, Plus, Upload, FileText, Download, Trash2,
  Folder, Tag, Search, User
} from 'lucide-react';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [newDocModal, setNewDocModal] = useState(false);

  // Form states
  const [filename, setFilename] = useState('');
  const [tag, setTag] = useState('Financial');

  const loadData = () => {
    api.get('/documents').then((res) => {
      setDocuments(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const tags = ['All', 'Financial', 'Invoices', 'Contracts', 'HR', 'Product'];

  const filteredDocs = documents.filter(d =>
    selectedTag === 'All' || d.tag === selectedTag
  );

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    if (!filename) return;
    try {
      await api.post('/documents', {
        filename,
        path: `/uploads/${filename.replace(/\s+/g, '_')}.pdf`,
        tag,
        size: Math.floor(Math.random() * 800000) + 120000
      });
      setNewDocModal(false);
      setFilename('');
      loadData();
    } catch (err) {
      alert('Error creating document record: ' + err.message);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Files className="text-[#F1A94E]" /> Documents & File Vault
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Centralized file repository organized by financial, contractual, product, and HR tags
          </p>
        </div>

        <button
          onClick={() => setNewDocModal(true)}
          className="o-btn o-btn-primary flex items-center gap-1.5"
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Tag Folders */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTag === t
                ? 'bg-[#714B67] text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            <Folder size={14} className={selectedTag === t ? 'text-purple-200' : 'text-[#017E84]'} />
            <span>{t}</span>
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="o-card flex flex-col justify-between p-5 space-y-3">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <span className="o-badge o-badge-teal">{doc.tag}</span>
              </div>

              <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                {doc.filename}
              </h3>

              <div className="space-y-1 mt-3 text-xs text-gray-400">
                <div>File Size: <strong className="text-gray-600 dark:text-gray-300">{formatBytes(doc.size)}</strong></div>
                <div>Added: {new Date(doc.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
              <span className="text-[11px] text-gray-400">{doc.uploader?.name || 'Admin'}</span>
              <button
                onClick={() => alert(`Downloading ${doc.filename}...`)}
                className="text-[#714B67] hover:underline flex items-center gap-1 font-semibold"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Document Modal */}
      {newDocModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-sm">
            <div className="o-modal-header">
              <span>Upload Document</span>
              <button onClick={() => setNewDocModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateDoc}>
              <div className="o-modal-body space-y-3">
                <div className="o-field">
                  <label>Document Title / Filename:</label>
                  <input
                    required
                    placeholder="e.g. Master Service Agreement 2026.pdf"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                  />
                </div>

                <div className="o-field">
                  <label>Category Tag:</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option value="Financial">Financial</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Invoices">Invoices</option>
                    <option value="HR">HR</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewDocModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
