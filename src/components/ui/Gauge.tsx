import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/cn';

export interface GaugeProps {
  value: number | null;
  min?: number;
  max: number;
  unit?: string;
  color?: string;
  label?: string;
  className?: string;
}

/** Radial gauge with a centered value. `null` value renders an em dash. */
export const Gauge: React.FC<GaugeProps> = ({
  value,
  min = 0,
  max,
  unit = '',
  color = '#059669',
  label,
  className,
}) => {
  const hasValue = value !== null && Number.isFinite(value);
  const clamped = hasValue ? Math.min(Math.max(value as number, min), max) : min;
  const data = [{ name: 'v', value: clamped, fill: color }];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-[112px] h-[112px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="72%"
            outerRadius="100%"
            startAngle={225}
            endAngle={-45}
            data={data}
            barSize={10}
          >
            <PolarAngleAxis type="number" domain={[min, max]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#eef2f6' }}
              dataKey="value"
              cornerRadius={8}
              angleAxisId={0}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold tabular-nums text-ink-900 dark:text-ink-50">
            {hasValue ? `${value}${unit}` : '—'}
          </span>
        </div>
      </div>
      {label && <span className="text-xs text-ink-500 dark:text-ink-400 -mt-1 text-center">{label}</span>}
    </div>
  );
};

export default Gauge;
