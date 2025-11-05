import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`} role="status" aria-live="polite">
        <span className="sr-only">{message}</span>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;