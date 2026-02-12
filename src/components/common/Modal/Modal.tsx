import React, { useEffect } from 'react';
import type { ModalBaseProps } from '../../../types/ui';
import Button from '../Button/Button';

export interface ModalProps extends ModalBaseProps {
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-auto rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-xl relative"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-border dark:border-border-dark">
          <h2 id="modal-title" className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
            {title}
          </h2>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 min-w-0 border-0 bg-transparent text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark rounded"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-border dark:border-border-dark flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
