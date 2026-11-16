import React from 'react';
import { cn } from '../../utils/cn';

export type ConnectionStatus = 'online' | 'offline' | 'stale';

export interface StatusDotProps {
  status: ConnectionStatus;
  label?: string;
  pulse?: boolean;
  className?: string;
}

const dotColor: Record<ConnectionStatus, string> = {
  online: 'bg-leaf-500',
  offline: 'bg-ink-400',
  stale: 'bg-wheat-500',
};

const textColor: Record<ConnectionStatus, string> = {
  online: 'text-leaf-700 dark:text-leaf-300',
  offline: 'text-ink-500 dark:text-ink-400',
  stale: 'text-wheat-700 dark:text-wheat-300',
};

/** Connection/health indicator: a colored dot with an optional label. */
export const StatusDot: React.FC<StatusDotProps> = ({ status, label, pulse = false, className }) => (
  <span className={cn('inline-flex items-center gap-1.5', className)}>
    <span className={cn('w-2 h-2 rounded-full', dotColor[status], pulse && status === 'online' && 'animate-pulse')} />
    {label && <span className={cn('text-xs font-medium', textColor[status])}>{label}</span>}
  </span>
);

export default StatusDot;
