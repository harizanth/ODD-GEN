import React from 'react';

// 4x4 dot-grid pictograms — the app's signature visual motif,
// echoing the Nothing Phone glyph interface.
const ICONS = {
  dashboard: [[0,0,1,1],[0,0,1,1],[1,1,0,0],[1,1,0,0]],
  crm:       [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1]],
  sales:     [[1,0,0,0],[1,1,0,0],[1,1,1,0],[1,1,1,1]],
  purchase:  [[1,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
  invoicing: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[0,0,0,1]],
  inventory: [[1,1,0,1],[1,0,1,1],[1,1,0,1],[1,0,1,1]],
  projects:  [[1,1,0,0],[1,1,0,1],[0,0,1,1],[1,0,1,1]],
  timesheets:[[0,1,1,0],[1,0,0,1],[1,0,1,1],[0,1,1,0]],
  hr:        [[0,1,1,0],[0,1,1,0],[1,1,1,1],[1,0,0,1]],
  helpdesk:  [[0,1,1,0],[1,0,0,1],[1,0,1,1],[1,1,0,0]],
  calendar:  [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,1]],
  contacts:  [[0,1,1,0],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
  knowledge: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
  documents: [[1,1,1,0],[1,0,0,1],[1,0,1,1],[1,1,1,1]],
  settings:  [[0,1,0,1],[1,1,1,0],[0,1,1,1],[1,0,1,0]],
};

export default function DotIcon({ name, size = 14 }) {
  const grid = ICONS[name] || ICONS.settings;
  const dots = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (grid[y][x]) dots.push(<circle key={`${x}-${y}`} cx={x * 4 + 2} cy={y * 4 + 2} r="1.5" fill="currentColor" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
      {dots}
    </svg>
  );
}
