import React from 'react';
import { IconClose } from './IconList';
import modalStyles from "../CSS/Components/Modal.module.css";
import confirmationModalStyles from '../CSS/Components/ConfirmationModal.module.css'


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
    <div className={modalStyles.overlay} onClick={handleOverlayClick}>
      <div className={confirmationModalStyles.confirmationModal}>
        <div className={modalStyles.modalHeader} >
          <h2 className={modalStyles.modalTitle} >{title}</h2>
          <button className={modalStyles.modalClose}  onClick={onClose} disabled={isLoading}>
            <IconClose />
          </button>
        </div>
        <div className={confirmationModalStyles.confirmationBody}>
          <p className={confirmationModalStyles.confirmationMessage}>{message}</p>
        </div>
        <div className={confirmationModalStyles.confirmationActions}>
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