import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from './Card';

export type KpiAccent = 'neutral' | 'success' | 'warning' | 'danger';

export interface KpiTileProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  accent?: KpiAccent;
  icon?: React.ReactNode;
  className?: string;
}

const valueColor: Record<KpiAccent, string> = {
  neutral: 'text-ink-900 dark:text-ink-50',
  success: 'text-leaf-600 dark:text-leaf-400',
  warning: 'text-wheat-600 dark:text-wheat-400',
  danger: 'text-red-600 dark:text-red-400',
};

/** Compact KPI/stat tile: label, large value, optional hint and icon. */
export const KpiTile: React.FC<KpiTileProps> = ({ label, value, hint, accent = 'neutral', icon, className }) => (
  <Card className={cn('p-4', className)}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-ink-500 dark:text-ink-400">{label}</span>
      {icon && <span className="text-ink-300 dark:text-ink-500">{icon}</span>}
    </div>
    <div className={cn('mt-1 text-3xl font-bold tabular-nums leading-none', valueColor[accent])}>{value}</div>
    {hint && <div className="mt-1 text-xs text-ink-400 dark:text-ink-500">{hint}</div>}
  </Card>
);

export default KpiTile;
