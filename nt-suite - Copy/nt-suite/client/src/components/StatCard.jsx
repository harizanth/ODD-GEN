import React from 'react';

export default function StatCard({ label, value, delta, isUp, ringPct }) {
  return (
    <div className="card">
      <div className="text-[9px] tracking-widest uppercase mb-2.5" style={{ color: 'var(--ink-faint)' }}>{label}</div>
      <div className="flex items-center gap-3.5">
        {ringPct !== undefined && (
          <div
            className="w-[52px] h-[52px] rounded-full flex-shrink-0 relative flex items-center justify-center"
            style={{ background: `conic-gradient(var(--red) ${ringPct * 3.6}deg, var(--line-soft) 0deg)` }}
          >
            <div className="absolute inset-[6px] rounded-full" style={{ background: 'var(--surface)' }} />
            <div className="relative z-10 text-[10px] font-bold">{ringPct}%</div>
          </div>
        )}
        <div>
          <div className="font-dot text-[26px]">{value}</div>
          {delta && (
            <div className="text-[10px] mt-0.5" style={{ color: isUp ? 'var(--green)' : 'var(--red)' }}>
              {isUp ? '▲' : '▼'} {delta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
