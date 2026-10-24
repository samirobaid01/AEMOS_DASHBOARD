import React from 'react';

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
                    ? 'bg-success dark:bg-success-dark text-white'
                    : isActive
                      ? 'bg-primary dark:bg-primary-dark text-white'
                      : 'bg-surfaceHover dark:bg-surfaceHover-dark text-textMuted dark:text-textMuted-dark border border-border dark:border-border-dark',
                ].join(' ')}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
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
                  isCompleted ? 'bg-success dark:bg-success-dark' : 'bg-border dark:bg-border-dark',
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
