import React from 'react';
import { cn } from '../../../utils/cn';

export interface PageProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Page: React.FC<PageProps> = ({ children, title, description, className }) => {
  return (
    <div className={cn('py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-1 text-sm text-textMuted dark:text-textMuted-dark">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Page;
