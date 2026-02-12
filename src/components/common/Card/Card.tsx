import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, header, className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden ${className}`}
    >
      {header != null && (
        <div className="px-4 py-3 sm:px-6 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          {header}
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;
