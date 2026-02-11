import React, { useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { ModalBaseProps } from '../../../types/ui';

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
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    width: '100%',
    maxWidth: '28rem',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: darkMode
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const headerStyle: React.CSSProperties = {
    padding: '1rem',
    borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0
  };

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: darkMode ? colors.textSecondary : '#6b7280'
  };

  const contentStyle: React.CSSProperties = {
    padding: '1rem'
  };

  const footerStyle: React.CSSProperties = {
    padding: '1rem',
    borderTop: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div 
        style={modalStyle} 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>{title}</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            aria-label="Close modal"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(0, 0, 0, 0.1)' : '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg
              style={{ width: '1.25rem', height: '1.25rem' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div style={contentStyle}>
          {children}
        </div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal; 