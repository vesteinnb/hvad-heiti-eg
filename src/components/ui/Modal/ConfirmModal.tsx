import React from 'react';
import Modal from './Modal';

export type ConfirmModalVariant = 'default' | 'danger' | 'warning' | 'success';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmModalVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
  loading = false,
  size = 'sm',
}) => {
  // Variant-specific styles
  const iconClasses = {
    default: 'text-4xl',
    danger: 'text-4xl',
    warning: 'text-4xl', 
    success: 'text-4xl',
  };

  const defaultIcons = {
    default: '❓',
    danger: '⚠️',
    warning: '⚠️',
    success: '✅',
  };

  const confirmButtonClasses = {
    default: 'bg-primary hover:bg-primary/90 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="mb-4">
          <div className={iconClasses[variant]}>
            {icon || defaultIcons[variant]}
          </div>
        </div>

        {/* Title */}
        <div className="text-xl font-heading font-bold text-neutral-700 mb-2">
          {title}
        </div>

        {/* Message */}
        <div className="text-neutral-600 font-body mb-6">
          {message}
        </div>

        {/* Additional warning for danger variant */}
        {variant === 'danger' && (
          <div className="text-sm text-red-600 font-medium mb-6">
            This action cannot be undone.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-neutral-700 hover:bg-gray-200 transition-all duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`
              flex-1 py-2 px-4 rounded-lg transition-all duration-150 font-medium 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              ${confirmButtonClasses[variant]}
            `}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;