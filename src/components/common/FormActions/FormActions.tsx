import React from 'react';

const MOBILE_BREAKPOINT = 768;

export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  stackOnMobile?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = '',
  stackOnMobile = true,
}) => {
  const [isNarrow, setIsNarrow] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    if (!stackOnMobile) return;
    const handleResize = () => setIsNarrow(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [stackOnMobile]);

  const stack = stackOnMobile && isNarrow;

  return (
    <div
      className={`flex justify-end mt-8 gap-3 ${stack ? 'flex-col-reverse' : 'flex-row'} ${className}`}
    >
      {children}
    </div>
  );
};

export default FormActions;
