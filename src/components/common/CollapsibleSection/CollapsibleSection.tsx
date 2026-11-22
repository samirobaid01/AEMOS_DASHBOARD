import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface CollapsibleSectionProps {
  /** Section heading. */
  title: React.ReactNode;
  /** Optional count badge shown next to the title. */
  count?: number;
  /** Optional action (e.g. an Add button) rendered on the right, outside the toggle. */
  action?: React.ReactNode;
  /** Whether the section starts expanded. Defaults to true. */
  defaultOpen?: boolean;
  /** Extra classes for the outer wrapper (padding, dividers, etc.). */
  className?: string;
  /** Extra classes for the content wrapper. */
  contentClassName?: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  count,
  action,
  defaultOpen = true,
  className,
  contentClassName,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-2 min-w-0 text-left bg-transparent border-0 p-0 cursor-pointer"
        >
          <ChevronDown
            className={cn(
              'w-5 h-5 shrink-0 text-textMuted dark:text-textMuted-dark transition-transform',
              !open && '-rotate-90',
            )}
            aria-hidden
          />
          <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
            {title}
            {count !== undefined && (
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 tabular-nums align-middle">
                {count}
              </span>
            )}
          </h2>
        </button>
        {action}
      </div>
      {open && <div className={cn('mt-4', contentClassName)}>{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
