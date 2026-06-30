import React, { useEffect } from 'react';
import '../../app/CSS/Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const toastClass = type === 'success' ? 'success' : 'error';

  return (
    <div className={`toast ${toastClass}`}>
      <span>{type === 'success' ? '✓' : '✗'}</span>
      <span>{message}</span>
      <button className='close-btn' onClick={onClose}>
        ×
      </button>
    </div>
  );
}