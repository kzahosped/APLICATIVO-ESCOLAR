import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 border-green-600';
            case 'error':
                return 'bg-red-500 border-red-600';
            case 'warning':
                return 'bg-yellow-500 border-yellow-600';
            case 'info':
                return 'bg-blue-500 border-blue-600';
        }
    };

    const getToastIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`${getToastStyles(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[280px] max-w-[400px] pointer-events-auto animate-slide-in`}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {getToastIcon(toast.type)}
                        </span>
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
        </ToastContext.Provider>
    );
};
