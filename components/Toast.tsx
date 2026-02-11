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
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      const closeTimer = setTimeout(onClose, 300); // Attendre la fin de l'animation
      return () => clearTimeout(closeTimer);
    }, duration);
    
    return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const styleConfig = {
    success: {
      icon: '✓',
      borderColor: 'border-emerald-500',
      iconColor: 'text-emerald-500',
      progressBg: 'bg-emerald-500',
    },
    error: {
      icon: '✗',
      borderColor: 'border-rose-500',
      iconColor: 'text-rose-500',
      progressBg: 'bg-rose-500',
    },
    warning: {
      icon: '⚠',
      borderColor: 'border-amber-500',
      iconColor: 'text-amber-500',
      progressBg: 'bg-amber-500',
    },
    info: {
      icon: 'ℹ',
      borderColor: 'border-cyan-500',
      iconColor: 'text-cyan-500',
      progressBg: 'bg-cyan-500',
    },
  };

  const { icon, borderColor, iconColor, progressBg } = styleConfig[type];

  return (
    <div
      className={`
        bg-white text-slate-800
        rounded-lg shadow-lg
        flex items-start
        border-l-4 ${borderColor}
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        min-w-[320px] max-w-[420px]
        relative overflow-hidden
      `}
    >
      <div className="flex items-start gap-3 p-4 w-full">
        <span className={`text-2xl flex-shrink-0 mt-0.5 ${iconColor}`}>{icon}</span>
        <div className="flex-1 min-w-0">
          {title && <div className="font-bold text-sm mb-1 leading-tight">{title}</div>}
          <div className="text-sm leading-snug text-slate-600">{message}</div>
          {className && !title?.includes(className) && (
            <div className="text-xs mt-1.5 text-slate-500 font-medium">
              📚 {className}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none mt-0.5"
        >
          ×
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-100">
        <div
          className={`h-full ${progressBg}`}
          style={{ animation: `shrink ${duration}ms linear` }}
        />
      </div>
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