import { ReactNode, useEffect } from "react";
import styles from "../CSS/Components/GenericModal.module.css";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal  ({ title, children, onClose }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  
  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // click on the backdrop
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={styles.dialog}>
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
          {title}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )

}

