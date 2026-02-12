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
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    gap: '0.75rem',
    flexDirection: stack ? 'column-reverse' : 'row',
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
};

export default FormActions;
