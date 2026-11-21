import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  const { type = 'info', message } = notification;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#121e14',
          border: '1px solid #1e3a24',
          color: '#4ade80',
          icon: CheckCircle2
        };
      case 'error':
        return {
          bg: '#201212',
          border: '1px solid #3f1e1e',
          color: '#f87171',
          icon: AlertCircle
        };
      default:
        return {
          bg: '#1c1b12',
          border: '1px solid #3d3a1f',
          color: '#facc15',
          icon: Info
        };
    }
  };

  const style = getStyle();
  const IconComponent = style.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: style.bg,
        border: style.border,
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '420px',
        animation: 'slideIn 0.25s ease'
      }}
    >
      <IconComponent size={20} color={style.color} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.9rem', color: '#f4f4f7', fontWeight: 500 }}>
        {message}
      </span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="btn-icon"
          style={{ width: '28px', height: '28px', marginLeft: 'auto' }}
          aria-label="Dismiss toast"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default Toast;
