/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        line: 'var(--line)',
        lineSoft: 'var(--line-soft)',
        ink: 'var(--ink)',
        inkDim: 'var(--ink-dim)',
        inkFaint: 'var(--ink-faint)',
        red: 'var(--red)',
        redDim: 'var(--red-dim)',
        green: 'var(--green)',
        amber: 'var(--amber)',
        odoo: {
          primary: '#714B67',
          'primary-dark': '#58374F',
          teal: '#017E84',
          'teal-light': '#00A09D',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', '"Patrick Hand"', 'cursive'],
        dot: ['"DotGothic16"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px -4px rgba(0,0,0,0.08)',
        'card-elevated': '0 4px 12px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
};
