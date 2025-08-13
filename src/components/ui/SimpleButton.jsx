import React from 'react';

const VARIANTS = {
  default: "bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary-light",
  secondary: "bg-secondary text-white hover:bg-secondary-dark focus:ring-2 focus:ring-secondary-light",
  outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary-light",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800 focus:ring-2 focus:ring-gray-200",
  destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

export const SimpleButton = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const variantClasses = VARIANTS[variant] || VARIANTS.default;
  const sizeClasses = SIZES[size] || SIZES.md;
  
  return (
    <button
      className={`rounded-md font-medium transition-colors focus:outline-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
