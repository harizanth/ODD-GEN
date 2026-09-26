import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      style={{ background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(2px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[420px] max-h-[70vh] overflow-y-auto rounded p-4.5 p-[18px]" style={{ background: 'var(--surface)', border: '1px dashed var(--red)' }}>
        <div className="font-dot text-[14px] mb-3.5 tracking-wide">{title}</div>
        {children}
      </div>
    </div>
  );
}
