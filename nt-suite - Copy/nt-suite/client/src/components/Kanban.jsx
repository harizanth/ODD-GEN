import React, { useState } from 'react';

/**
 * Generic kanban board.
 * columns: [{ key, label }]
 * items: array of any shape, each must have a `stageKey` matching a column key
 * renderCard: (item) => JSX
 * onDrop: (item, newStageKey) => void
 */
export default function Kanban({ columns, items, getKey, getStage, renderCard, onDrop }) {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => {
        const colItems = items.filter((it) => getStage(it) === col.key);
        return (
          <div
            key={col.key}
            className="min-w-[240px] flex-shrink-0 rounded p-2.5"
            style={{
              background: 'var(--surface)',
              border: overCol === col.key ? '1px dashed var(--red)' : '1px dashed var(--line)',
            }}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.key); }}
            onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              setOverCol(null);
              const item = items.find((it) => String(getKey(it)) === dragId);
              if (item && getStage(item) !== col.key) onDrop(item, col.key);
            }}
          >
            <div className="flex justify-between items-center mb-2 px-0.5">
              <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--ink-dim)' }}>{col.label}</span>
              <span className="text-[9px] rounded-full px-1.5" style={{ border: '1px solid var(--line)', color: 'var(--ink-faint)' }}>{colItems.length}</span>
            </div>
            {colItems.map((item) => (
              <div
                key={getKey(item)}
                draggable
                onDragStart={() => setDragId(String(getKey(item)))}
                onDragEnd={() => setDragId(null)}
                className="rounded p-2.5 mb-2 text-[11px] cursor-grab active:cursor-grabbing"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)', opacity: dragId === String(getKey(item)) ? 0.4 : 1 }}
              >
                {renderCard(item)}
              </div>
            ))}
            {colItems.length === 0 && (
              <div className="text-[10px] text-center py-4" style={{ color: 'var(--ink-faint)' }}>Nothing here</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
