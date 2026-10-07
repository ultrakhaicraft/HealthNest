import { FormHTMLAttributes, ReactNode, useEffect, useId } from "react";
import styles from "../CSS/Components/GenericModal.module.css";
import { IconClose } from "./IconList";

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  isBusy?: boolean; /** True while a request is send to backend: blocks Esc, backdrop click and the X button */
}

export default function Modal  ({ title, onClose, children, size = 'md', isBusy = false }: ModalProps) {
  const titleId= useId();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, isBusy]);

  
  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
      if (e.target === e.currentTarget && !isBusy) onClose(); // click on the backdrop
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={isBusy}
        className={`${styles.dialog} ${styles[size]}`}
      >

        <div className={styles.modalHeader}>
          <h2 id={titleId} className={styles.modalTitle}>{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isBusy}
            className={styles.closeButton}
          >
            <IconClose />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )

}


/* ---------- Small building blocks so every form modal looks the same ---------- */

export const ModalForm = (props: FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props} className={styles.form} />
);

interface ModalFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export const ModalField = ({ label, htmlFor, error, children }: ModalFieldProps) => (
  <div className={styles.field}>
    <label htmlFor={htmlFor} className={styles.label}>{label}</label>
    {children}
    {error && <div role="alert" className={styles.fieldError}>{error}</div>}
  </div>
);

export const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className={styles.modalFooter}>{children}</div>
);

