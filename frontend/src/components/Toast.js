import React from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  const toastRef = React.useRef(null);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    // Focus the toast when it appears for screen readers
    if (toastRef.current) {
      toastRef.current.focus();
    }
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <div 
      ref={toastRef}
      className={`toast toast-${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex="-1"
      onKeyDown={handleKeyDown}
    >
      <span className="toast-message">{message}</span>
      <button 
        className="toast-close" 
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;