import React from 'react';

const mapType = {
  now: 'Đang chiếu',
  soon: 'Sắp chiếu',
  hot: 'Hot'
};

export function StatusBadge({ type, children, className = '', ...rest }) {
  const label = children || mapType[type] || '';
  return (
    <span
      className={`status-badge ${type ? type : ''} ${className}`.trim()}
      {...rest}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
