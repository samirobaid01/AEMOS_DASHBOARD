import React from 'react';
import Button from '../common/Button/Button';

interface EmptyStateProps {
  message: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm">
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )}
      <h3 className="mt-2 text-base font-medium text-textPrimary dark:text-textPrimary-dark text-center m-0">
        {message}
      </h3>
      <p className="mt-2 text-sm text-textMuted dark:text-textMuted-dark max-w-[20rem] text-center m-0">
        {description}
      </p>
      <Button type="button" onClick={onAction} className="mt-6">
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
