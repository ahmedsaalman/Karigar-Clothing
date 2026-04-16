// src/context/ToastContext.jsx

import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  function showToast(message, type = 'success') {
    // Create unique ID using current time
    const id = Date.now();

    const newToast = {
      id,
      message,
      type,    // 'success', 'error', 'info'
    };

    // Add to list
    setToasts(prev => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  // Convenience methods
  function showSuccess(message) {
    showToast(message, 'success');
  }

  function showError(message) {
    showToast(message, 'error');
  }

  function showInfo(message) {
    showToast(message, 'info');
  }

  const value = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}

export { ToastProvider, useToast };