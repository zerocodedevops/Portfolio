// RUTA: ./src/components/common/ConfirmDialog.jsx

import type { MouseEventHandler } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirmar acción', 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200';
      case 'info':
        return 'btn-primary';
      default:
        return 'btn-danger';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(event: Parameters<MouseEventHandler<HTMLDivElement>>[0]) => event.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onCancel}
                className="btn-secondary"
                autoFocus
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={getVariantStyles()}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
