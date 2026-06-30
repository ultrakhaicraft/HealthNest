import React from 'react';
import { IconClose } from './IconList';
import '../app/CSS/Modal.css'; // Ensure you have appropriate styles for the modal

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'button-danger';
      case 'warning':
        return 'button-warning';
      case 'info':
        return 'button-primary';
      default:
        return 'button-danger';
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} disabled={isLoading}>
            <IconClose />
          </button>
        </div>
        <div className="confirmation-body">
          <p className="confirmation-message">{message}</p>
        </div>
        <div className="confirmation-actions">
          <button 
            className="button button-secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className={`button ${getConfirmButtonClass()}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};