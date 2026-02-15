import React from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const Card: React.FC<CardProps> = ({ children, header, className, contentClassName }) => {
  return (
    <div
      className={cn('rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden', className)}
    >
      {header != null && (
        <div className="px-4 py-3 sm:px-6 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          {header}
        </div>
      )}
      <div className={cn('p-4 sm:p-6', contentClassName)}>{children}</div>
    </div>
  );
};

export default Card;
