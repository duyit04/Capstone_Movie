import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'medium', text = 'Đang tải...' }) {
  const sizeClass = size === 'small' ? 'spinner-small' : 
                    size === 'large' ? 'spinner-large' : 'spinner-medium';
  
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle spinner-circle-outer"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}
