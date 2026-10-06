import React, { useEffect } from 'react';
import styles from '../../app/CSS/Others/Toast.module.css';

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

  const toastType = type === 'success' ? 'success' : 'error';

  const toastClassName = `${styles.toast} ${styles[toastType]}`;
  return (
    <div className={toastClassName}>
      <span>{type === 'success' ? '✓' : '✗'}</span>
      <span>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        ×
      </button>
    </div>
  );
}