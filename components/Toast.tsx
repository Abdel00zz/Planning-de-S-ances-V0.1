import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  className?: string;  // Nom de la classe concernée
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, title, className, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Apparition avec délai
    setTimeout(() => setIsVisible(true), 10);
    
    // Disparition automatique
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500/95 to-emerald-600/95 border-emerald-400/50',
    error: 'bg-gradient-to-r from-rose-500/95 to-rose-600/95 border-rose-400/50',
    warning: 'bg-gradient-to-r from-amber-500/95 to-amber-600/95 border-amber-400/50',
    info: 'bg-gradient-to-r from-cyan-500/95 to-cyan-600/95 border-cyan-400/50'
  };

  return (
    <div 
      className={`
        ${styles[type]}
        backdrop-blur-xl
        text-white px-4 py-3 rounded-xl
        shadow-2xl shadow-black/30
        border-2 border-opacity-40
        flex items-start gap-3
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        min-w-[300px] max-w-[420px]
      `}
    >
      <div className="flex items-start gap-3 flex-1">
        <span className="text-2xl flex-shrink-0 mt-0.5">{icons[type]}</span>
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-bold text-sm mb-1 leading-tight">
              {title}
            </div>
          )}
          <div className="text-sm leading-snug opacity-95">
            {message}
          </div>
          {className && !title?.includes(className) && (
            <div className="text-xs mt-1.5 opacity-75 font-medium">
              📚 {className}
            </div>
          )}
        </div>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="flex-shrink-0 text-white/60 hover:text-white transition-colors text-xl leading-none mt-0.5"
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ 
    id: string; 
    message: string; 
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    className?: string;
    duration?: number;
  }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
      <div className="space-y-2.5 pointer-events-auto">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Toast
              message={toast.message}
              type={toast.type}
              title={toast.title}
              className={toast.className}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;
