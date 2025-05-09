import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface WalkthroughStepProps {
  targetSelector: string;
  title?: string;
  content: string;
  onNext: () => void;
  onPrev?: () => void;
  onSkip: () => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  isFirstStep?: boolean;
  isLastStep?: boolean;
  stepNumber?: number;
  totalSteps?: number;
}

const WalkthroughStep: React.FC<WalkthroughStepProps> = ({
  targetSelector,
  title,
  content,
  onNext,
  onPrev,
  onSkip,
  placement = 'bottom',
  isFirstStep = false,
  isLastStep = false,
  stepNumber = 1,
  totalSteps = 1,
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const isDarkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const element = document.querySelector(targetSelector) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Add highlight class to target element
      element.classList.add('walkthrough-highlight');
      
      // Calculate position for tooltip
      updateTooltipPosition(element);
      
      // Set up resize observer to update position if needed
      const resizeObserver = new ResizeObserver(() => {
        updateTooltipPosition(element);
      });
      
      resizeObserver.observe(element);
      
      // Add scroll listener
      const handleScroll = () => updateTooltipPosition(element);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        element.classList.remove('walkthrough-highlight');
        resizeObserver.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [targetSelector]);
  
  const updateTooltipPosition = (element: HTMLElement) => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const tooltipHeight = 180; // Approximate height
    const tooltipWidth = 300; // Approximate width
    const spacing = 10; // Space between target and tooltip
    
    let top = 0;
    let left = 0;
    
    switch (placement) {
      case 'top':
        top = rect.top - tooltipHeight - spacing;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + spacing;
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - spacing;
        break;
      default: // bottom
        top = rect.bottom + spacing;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
    }
    
    // Keep tooltip within viewport
    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) {
      left = window.innerWidth - tooltipWidth - 20;
    }
    
    if (top < 20) top = 20;
    if (top + tooltipHeight > window.innerHeight - 20) {
      top = window.innerHeight - tooltipHeight - 20;
    }
    
    setTooltipPosition({ top, left });
  };
  
  if (!targetElement) return null;
  
  // Overlay style
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
    pointerEvents: 'auto',
  };
  
  // Tooltip style
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    width: '300px',
    zIndex: 1000,
    backgroundColor: isDarkMode ? '#1f2937' : 'white',
    color: isDarkMode ? '#f9fafb' : '#1f2937',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1rem',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
  };
  
  // Tooltip arrow style
  const tooltipArrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: isDarkMode ? '#1f2937' : 'white',
    transform: 'rotate(45deg)',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    zIndex: -1,
  };
  
  // Position the arrow based on placement
  switch (placement) {
    case 'top':
      tooltipArrowStyle.bottom = '-6px';
      tooltipArrowStyle.left = 'calc(50% - 5px)';
      tooltipArrowStyle.borderTop = '0';
      tooltipArrowStyle.borderLeft = '0';
      break;
    case 'right':
      tooltipArrowStyle.left = '-6px';
      tooltipArrowStyle.top = 'calc(50% - 5px)';
      tooltipArrowStyle.borderBottom = '0';
      tooltipArrowStyle.borderLeft = '0';
      break;
    case 'left':
      tooltipArrowStyle.right = '-6px';
      tooltipArrowStyle.top = 'calc(50% - 5px)';
      tooltipArrowStyle.borderTop = '0';
      tooltipArrowStyle.borderRight = '0';
      break;
    default: // bottom
      tooltipArrowStyle.top = '-6px';
      tooltipArrowStyle.left = 'calc(50% - 5px)';
      tooltipArrowStyle.borderBottom = '0';
      tooltipArrowStyle.borderRight = '0';
      break;
  }
  
  // Title style
  const titleStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.25rem'
  };
  
  // Content style
  const contentStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    marginBottom: '1rem'
  };
  
  // Controls container style
  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem'
  };
  
  // Step counter style
  const stepCounterStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: isDarkMode ? '#b49470' : '#a27b54' // dark:text-soil-400 : text-soil-500
  };
  
  // Buttons container style
  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem'
  };
  
  // Button base style
  const buttonBaseStyle: React.CSSProperties = {
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
  };
  
  // Previous button style
  const prevButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'transparent',
    color: isDarkMode ? '#d0b190' : '#735236', // dark:text-soil-300 : text-soil-700
    border: `1px solid ${isDarkMode ? '#735236' : '#d0b190'}`, // dark:border-soil-700 : border-soil-300
  };
  
  // Next button style
  const nextButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: isDarkMode ? '#047857' : '#059669', // dark:bg-leaf-700 : bg-leaf-600
    color: 'white',
    border: 'none',
  };
  
  // Close button style
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    color: isDarkMode ? '#b49470' : '#a27b54', // dark:text-soil-400 : text-soil-500
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
  };
  
  return (
    <>
      {createPortal(
        <div style={overlayStyle} onClick={e => e.stopPropagation()} />,
        document.body
      )}
      
      {createPortal(
        <div style={tooltipStyle}>
          <div style={tooltipArrowStyle} />
          
          {title && (
            <h3 style={titleStyle}>{title}</h3>
          )}
          
          <p style={contentStyle}>{content}</p>
          
          <div style={controlsStyle}>
            <div style={stepCounterStyle}>
              Step {stepNumber} of {totalSteps}
            </div>
            
            <div style={buttonsContainerStyle}>
              {!isFirstStep && onPrev && (
                <button
                  style={prevButtonStyle}
                  onClick={onPrev}
                >
                  Previous
                </button>
              )}
              
              <button
                style={nextButtonStyle}
                onClick={onNext}
              >
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
          
          <button
            style={closeButtonStyle}
            onClick={onSkip}
            aria-label="Skip walkthrough"
          >
            ×
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default WalkthroughStep; 