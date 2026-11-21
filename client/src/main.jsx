import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Modern Web Guidance: Interaction state tracker for cross-browser fallback
if (typeof window !== 'undefined' && !CSS.supports('selector(:user-invalid)')) {
  const dirtyFields = new WeakSet();
  document.addEventListener(
    'blur',
    (e) => {
      const el = e.target;
      if (el.matches?.('input, select, textarea')) {
        dirtyFields.add(el);
        if (el.checkValidity) {
          el.classList.toggle('user-invalid-fallback', !el.checkValidity());
        }
      }
    },
    true
  );

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.matches?.('input, select, textarea') && dirtyFields.has(el)) {
      if (el.checkValidity) {
        el.classList.toggle('user-invalid-fallback', !el.checkValidity());
      }
    }
  });

  document.addEventListener(
    'invalid',
    (e) => {
      const el = e.target;
      if (el.matches?.('input, select, textarea')) {
        dirtyFields.add(el);
        el.classList.add('user-invalid-fallback');
      }
    },
    true
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
