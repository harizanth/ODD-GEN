import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  BookOpen, Plus, FileText, Search, User, Clock,
  Folder, ChevronRight, Edit3, Trash2
} from 'lucide-react';

export default function Knowledge() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newArticleModal, setNewArticleModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sales');
  const [content, setContent] = useState('');

  const loadData = () => {
    api.get('/knowledge').then((res) => {
      setArticles(res || []);
      if (res && res.length > 0 && !selectedArticle) {
        setSelectedArticle(res[0]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const art = await api.post('/knowledge', {
        title,
        category,
        content
      });
      setNewArticleModal(false);
      setTitle('');
      setContent('');
      loadData();
      setSelectedArticle(art);
    } catch (err) {
      alert('Error creating article: ' + err.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-var(--topbar-h))] bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Knowledge Tree */}
      <div className="w-72 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <BookOpen size={14} className="text-[#00A09D]" /> Playbooks & Wiki
          </h2>
          <button
            onClick={() => setNewArticleModal(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            title="Create Article"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {articles.map((art) => (
            <button
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex flex-col gap-0.5 ${
                selectedArticle?.id === art.id
                  ? 'bg-[#714B67] text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="font-semibold truncate">{art.title}</span>
              <span className={`text-[10px] ${selectedArticle?.id === art.id ? 'text-purple-200' : 'text-gray-400'}`}>
                {art.category || 'General'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Article Reader & Editor */}
      <div className="flex-1 flex flex-col overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {selectedArticle ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <span className="o-badge o-badge-teal mb-2">{selectedArticle.category}</span>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {selectedArticle.title}
                </h1>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span>Author: {selectedArticle.author?.name || 'Administrator'}</span>
                  <span>•</span>
                  <span>Updated: {new Date(selectedArticle.updatedAt || selectedArticle.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans pt-2">
              {selectedArticle.content}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BookOpen size={48} className="mb-2 opacity-40" />
            <p className="text-sm">Select an article from the left sidebar or create a new playbook</p>
          </div>
        )}
      </div>

      {/* New Article Modal */}
      {newArticleModal && (
        <div className="o-modal-overlay">
          <div className="o-modal max-w-xl">
            <div className="o-modal-header">
              <span>Create Knowledge Article</span>
              <button onClick={() => setNewArticleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateArticle}>
              <div className="o-modal-body space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 o-field">
                    <label>Article Title:</label>
                    <input
                      required
                      placeholder="e.g. Sales Onboarding SOP"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="o-field">
                    <label>Category:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>

                <div className="o-field">
                  <label>Article Body (Markdown supported):</label>
                  <textarea
                    rows={8}
                    placeholder="Write detailed documentation, guides, or policies..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </div>
              <div className="o-modal-footer">
                <button type="button" onClick={() => setNewArticleModal(false)} className="o-btn">Cancel</button>
                <button type="submit" className="o-btn o-btn-primary">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
