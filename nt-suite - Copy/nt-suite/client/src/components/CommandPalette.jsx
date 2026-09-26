import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

const NAV_COMMANDS = [
  { label: 'Go to Dashboard', path: '/', hint: 'nav' },
  { label: 'Go to CRM Pipeline', path: '/crm', hint: 'nav' },
  { label: 'Go to Sales Orders', path: '/sales', hint: 'nav' },
  { label: 'Go to Purchase Orders', path: '/purchase', hint: 'nav' },
  { label: 'Go to Invoicing', path: '/invoicing', hint: 'nav' },
  { label: 'Go to Inventory', path: '/inventory', hint: 'nav' },
  { label: 'Go to Projects', path: '/projects', hint: 'nav' },
  { label: 'Go to Timesheets', path: '/timesheets', hint: 'nav' },
  { label: 'Go to Employees', path: '/hr', hint: 'nav' },
  { label: 'Go to Helpdesk', path: '/helpdesk', hint: 'nav' },
  { label: 'Go to Calendar', path: '/calendar', hint: 'nav' },
  { label: 'Go to Contacts', path: '/contacts', hint: 'nav' },
  { label: 'Go to Knowledge', path: '/knowledge', hint: 'nav' },
  { label: 'Go to Documents', path: '/documents', hint: 'nav' },
  { label: 'Go to Settings', path: '/settings', hint: 'nav' },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const data = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch { setResults([]); }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const filteredNav = useMemo(
    () => NAV_COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const items = useMemo(() => {
    const searchItems = results.map((r) => ({ label: r.label, hint: r.type, action: () => navigate(`/${r.module}`) }));
    const navItems = filteredNav.map((c) => ({ label: c.label, hint: c.hint, action: () => navigate(c.path) }));
    return [...navItems, ...searchItems];
  }, [filteredNav, results, navigate]);

  function run(i) {
    const item = items[i];
    if (item) { item.action(); onClose(); }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); run(sel); }
    if (e.key === 'Escape') onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh]"
      style={{ background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(3px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[480px] rounded overflow-hidden" style={{ background: 'var(--surface)', border: '1px dashed var(--red)' }}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSel(0); }}
          onKeyDown={onKeyDown}
          placeholder="Type a command or search…"
          className="w-full bg-transparent px-4 py-3.5 text-[13px] font-mono"
          style={{ borderBottom: '1px dashed var(--line)', color: 'var(--ink)', outline: 'none' }}
          autoComplete="off"
        />
        <div className="max-h-[280px] overflow-y-auto p-1.5">
          {items.length === 0 && <div className="px-2.5 py-2 text-[12px]" style={{ color: 'var(--ink-faint)' }}>No results</div>}
          {items.map((item, i) => (
            <div
              key={i}
              onMouseDown={() => run(i)}
              onMouseEnter={() => setSel(i)}
              className="flex justify-between px-2.5 py-2 text-[12px] rounded cursor-pointer"
              style={{ background: i === sel ? 'var(--surface-2)' : 'transparent', color: i === sel ? 'var(--ink)' : 'var(--ink-dim)' }}
            >
              <span>{item.label}</span>
              <span className="text-[9px]" style={{ color: 'var(--ink-faint)' }}>{item.hint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
