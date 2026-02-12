import React from 'react';
import Button from '../common/Button/Button';

interface EmptyStateProps {
  message: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, description, actionLabel, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm dark:shadow-md">
      {icon ? (
        icon
      ) : (
        <svg
          className="w-12 h-12 text-textMuted dark:text-textMuted-dark mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      )}
      <h3 className="mt-2 text-base font-medium text-textPrimary dark:text-textPrimary-dark text-center">{message}</h3>
      <p className="mt-2 text-sm text-textMuted dark:text-textMuted-dark max-w-xs text-center">{description}</p>
      <Button type="button" onClick={onAction} className="mt-6">
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
