import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200',
  success: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-200',
  warning: 'bg-wheat-100 text-wheat-800 dark:bg-wheat-900 dark:text-wheat-200',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

/** Small status/label pill. */
export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className, children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap',
      variantClasses[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
