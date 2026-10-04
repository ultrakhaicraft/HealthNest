// src/components/Elements/Spinner/Spinner.tsx
import React from 'react';
import '../app/CSS/Others/Spinner.css'; // Import the CSS for the spinner

// Define the types for the component props
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const Spinner = ({ size = 'medium' }: SpinnerProps) => {
  // Combine the base spinner class with the size-specific class
  const spinnerClass = `.spinner ${size}`;

  return <div className={spinnerClass}></div>;
};


export const FullPageSpinner =({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Animated Spinner Ring */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      
      {/* Optional Contextual Text */}
      {message && (
        <p className="mt-4 text-sm font-medium text-white tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
