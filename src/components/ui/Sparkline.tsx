import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/cn';

export interface SparklineProps {
  data: number[];
  color?: string;
  className?: string;
}

/** Tiny inline trend line — no axes, grid, or tooltip. Renders empty gracefully. */
export const Sparkline: React.FC<SparklineProps> = ({ data, color = '#0ea5e9', className }) => {
  if (!data || data.length < 2) {
    // Not enough points to draw a line yet; keep the row height stable.
    return <div className={cn('h-5 w-full', className)} aria-hidden="true" />;
  }

  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div className={cn('h-5 w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
