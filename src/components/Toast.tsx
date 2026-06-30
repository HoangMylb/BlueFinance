import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const bgColors = {
    success: 'bg-emerald-50 text-emerald-950 border border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-50 dark:border-emerald-800',
    error: 'bg-rose-50 text-rose-950 border border-rose-200 dark:bg-rose-950/90 dark:text-rose-50 dark:border-rose-800',
    info: 'bg-blue-50 text-blue-950 border border-blue-200 dark:bg-blue-950/90 dark:text-blue-50 dark:border-blue-800'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md max-w-sm ${bgColors[type]}`}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <p className="text-sm font-medium pr-4">{message}</p>
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
