// src/components/Elements/Spinner/Spinner.tsx
import styles from '../CSS/Components/Spinner.module.css';

type SpinnerSize = 'small' | 'medium' | 'large';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string; // Optional className for additional styling
  decorative?: boolean; // Set true when a parent already announces loading state to screen readers
}

interface FullPageSpinnerProps {
  message?: string;
}

export const Spinner = ({ size = 'medium', className, decorative = false }: SpinnerProps) => {
  const spinnerClass = [styles.spinner, styles[size], className].filter(Boolean).join(' ');

  return decorative ? (
    <div className={spinnerClass} aria-hidden="true" />
  ) : (
    <div className={spinnerClass} role="status" aria-label="Loading" />
  );
};


export const FullPageSpinner = ({ message = 'Loading...' }: FullPageSpinnerProps) => (
  <div className={styles.fullPageSpinner} role="status" aria-live="polite">
    <Spinner size="medium" decorative />
    {message && <p className={styles.spinnerMessage}>{message}</p>}
  </div>
);
