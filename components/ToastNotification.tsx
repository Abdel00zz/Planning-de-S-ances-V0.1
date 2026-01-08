import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'conflict';
  title: string;
  message: string;
  details?: string[];
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'conflict': return '⚡';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-600 border-emerald-700';
      case 'error': return 'bg-red-600 border-red-700';
      case 'warning': return 'bg-amber-600 border-amber-700';
      case 'conflict': return 'bg-purple-600 border-purple-700';
      case 'info': return 'bg-blue-600 border-blue-700';
      default: return 'bg-gray-600 border-gray-700';
    }
  };

  return (
    <div
      className={`${getColors()} text-white rounded-lg shadow-2xl border-2 p-4 mb-3 min-w-[320px] max-w-md animate-slide-in`}
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg mb-1">
            {toast.title}
          </div>
          <div className="text-sm opacity-90 mb-2">
            {toast.message}
          </div>
          {toast.details && toast.details.length > 0 && (
            <div className="bg-black bg-opacity-20 rounded p-2 text-xs space-y-1 mt-2">
              {toast.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="opacity-60">•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="text-white hover:text-gray-200 text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-white hover:bg-opacity-20 transition"
        >
          ×
        </button>
      </div>
      
      {/* Barre de progression */}
      <div className="mt-3 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white bg-opacity-60 rounded-full"
          style={{
            animation: `shrink ${toast.duration || 5000}ms linear`
          }}
        />
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};

export default Toast;
