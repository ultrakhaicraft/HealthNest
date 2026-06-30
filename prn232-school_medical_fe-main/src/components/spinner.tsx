// src/components/Elements/Spinner/Spinner.tsx
import React from 'react';
import '../app/CSS/Spinner.css'; // Import the CSS for the spinner

// Define the types for the component props
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const Spinner = ({ size = 'medium' }: SpinnerProps) => {
  // Combine the base spinner class with the size-specific class
  const spinnerClass = `.spinner ${size}`;

  return <div className={spinnerClass}></div>;
};