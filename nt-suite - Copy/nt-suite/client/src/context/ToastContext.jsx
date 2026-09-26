import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((text) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-5 right-5 z-[100] px-4 py-2.5 text-[11px] rounded transition-all duration-300"
        style={{
          background: 'var(--surface)',
          border: '1px dashed var(--red)',
          color: 'var(--ink)',
          opacity: msg ? 1 : 0,
          transform: msg ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: 'none',
        }}
      >
        {msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
