// src/components/Toast.jsx

import { useToast } from '../context/ToastContext';

function Toast() {
  const { toasts, removeToast } = useToast();

  // If no toasts, render nothing
  if (toasts.length === 0) return null;

  // Color map for toast types
  const toastColors = {
    success: {
      background: '#1a1a1a',
      accent: '#27ae60',
      icon: '✓',
    },
    error: {
      background: '#1a1a1a',
      accent: '#e74c3c',
      icon: '✕',
    },
    info: {
      background: '#1a1a1a',
      accent: '#d4af37',
      icon: 'ℹ',
    },
  };

  return (
    <div style={styles.container}>
      {toasts.map(toast => {
        const colors = toastColors[toast.type] || toastColors.info;
        return (
          <div key={toast.id} style={styles.toast}>

            {/* Message */}
            <p style={styles.message}>{toast.message}</p>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              style={styles.closeBtn}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

          </div>
        );
      })}
    </div>
  );
}

// CSS animation for slide in
const toastCSS = `
  @keyframes slideIn {
    from {
      transform: translateX(110%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

function ToastWithStyle() {
  return (
    <>
      <style>{toastCSS}</style>
      <Toast />
    </>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '360px',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '14px 16px',
    borderRadius: '4px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    animation: 'slideIn 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
  },
  icon: {
    fontSize: '1rem',
    fontWeight: '700',
    flexShrink: 0,
    marginLeft: '8px',
  },
  message: {
    flex: 1,
    fontSize: '0.85rem',
    lineHeight: '1.4',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '2px',
    flexShrink: 0,
  },
};

export default ToastWithStyle;