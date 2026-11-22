import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface RuleCreationStepperProps {
  steps: Step[];
  currentStep: number;
}

const RuleCreationStepper: React.FC<RuleCreationStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center mb-6" role="list" aria-label="Rule creation steps">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <React.Fragment key={index}>
            <div
              className="flex items-center gap-2 shrink-0"
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors',
                  isCompleted
                    ? 'bg-leaf-600 text-white'
                    : isActive
                      ? 'bg-leaf-600 text-white ring-2 ring-leaf-200 dark:ring-leaf-900'
                      : 'bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400',
                ].join(' ')}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={[
                  'text-sm font-medium',
                  isActive
                    ? 'text-textPrimary dark:text-textPrimary-dark'
                    : 'text-textMuted dark:text-textMuted-dark',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={[
                  'flex-1 h-px mx-3 transition-colors',
                  isCompleted ? 'bg-leaf-600' : 'bg-border dark:bg-border-dark',
                ].join(' ')}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RuleCreationStepper;
