import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation (for interactive/widget cards). */
  interactive?: boolean;
}

/** Base surface: white panel, subtle border, rounded. Dark-mode ready via tokens. */
export const Card: React.FC<CardProps> = ({ interactive = true, className, children, ...props }) => (
  <div
    className={cn(
      'bg-white dark:bg-ink-800 rounded-xl border border-ink-200 dark:border-ink-700',
      interactive && 'transition-shadow hover:shadow-lg hover:shadow-ink-900/5',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;
