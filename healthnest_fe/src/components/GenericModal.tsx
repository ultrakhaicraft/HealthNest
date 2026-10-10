import { FormHTMLAttributes, ReactNode, useEffect, useId } from "react";
import styles from '../CSS/Components/Modal.module.css';
import { IconClose } from "./IconList";

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  isBusy?: boolean; /** True while a request is send to backend: blocks Esc, backdrop click and the X button */
}

export default function Modal({ title, onClose, children, size = 'md', isBusy = false }: ModalProps) {
  const titleId = useId();

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
  fullWidth?: boolean;

}

export const ModalField = ({ label, htmlFor, error, fullWidth, children }: ModalFieldProps) => (
  <div className={`${styles.field} ${fullWidth ? styles.fullRow : ''}`}>
    <label htmlFor={htmlFor} className={styles.label}>{label}</label>
    {children}
    {error && <div role="alert" className={styles.fieldError}>{error}</div>}
  </div>
);

/** Two columns on desktop, one on mobile. Put ModalField / ModalReadOnly inside it. */
export const ModalGrid = ({ children }: { children: ReactNode }) => (
  <div className={styles.grid}>{children}</div>
);

export const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className={styles.modalFooter}>{children}</div>
);


interface ModalReadOnlyProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
  /** Grey box, for long text such as descriptions */
  block?: boolean;
}

export const ModalReadOnly = ({ label, children, fullWidth, block }: ModalReadOnlyProps) => (
  <div className={`${styles.field} ${fullWidth ? styles.fullRow : ''}`}>
    <span className={styles.label}>{label}</span>
    <div className={`${styles.readOnlyValue} ${block ? styles.readOnlyBlock : ''}`}>{children}</div>
  </div>
);
