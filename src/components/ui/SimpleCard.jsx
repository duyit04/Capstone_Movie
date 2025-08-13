import React from 'react';

export const SimpleCard = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div 
      className={`rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg ${className}`}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const SimpleCardHeader = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div 
      className={`p-4 ${className}`}
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-alt)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const SimpleCardContent = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div 
      className={`p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SimpleCardFooter = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div 
      className={`p-4 ${className}`}
      style={{
        borderTop: '1px solid var(--color-border)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default SimpleCard;
