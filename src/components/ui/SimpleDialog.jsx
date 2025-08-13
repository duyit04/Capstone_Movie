import React, { useState } from 'react';
import SimpleButton from './SimpleButton';

export const SimpleDialog = ({ 
  trigger, 
  title, 
  description, 
  children, 
  className = "",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  
  return (
    <>
      <div onClick={openDialog}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div 
            className={`w-full max-w-md bg-white rounded-lg shadow-2xl animate-fadeIn ${className}`}
            {...props}
            style={{animation: 'fadeIn 0.2s ease-out'}}
          >
            <div className="flex justify-between items-start p-4 border-b bg-gray-50">
              <div>
                {title && <h3 className="text-xl font-semibold text-primary">{title}</h3>}
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors" 
                onClick={closeDialog}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {children}
            </div>
            
            <div className="flex justify-end space-x-2 p-4 border-t">
              <SimpleButton 
                variant="ghost" 
                size="sm" 
                onClick={closeDialog}
              >
                Cancel
              </SimpleButton>
              <SimpleButton 
                variant="default" 
                size="sm" 
                onClick={closeDialog}
              >
                Confirm
              </SimpleButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleDialog;
