import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import Button from '../Button/Button';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const retryRef = useRef(0);
  const maxRetries = 10;
  
  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlClasses = document.documentElement.classList;
      const bodyClasses = document.body.classList;
      
      console.log('HTML classes:', [...htmlClasses]);
      console.log('Body classes:', [...bodyClasses]);
      
      const isDark = 
        htmlClasses.contains('dark') || 
        bodyClasses.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      console.log('Dark mode detected:', isDark);
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Create a MutationObserver to watch for changes to the class attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    
    // Clean up the observer on unmount
    return () => observer.disconnect();
  }, []);
  
  // Find target element with retry mechanism
  useEffect(() => {
    console.log(`Looking for element with selector: ${targetSelector}`);
    
    const findElement = () => {
      const element = document.querySelector(targetSelector) as HTMLElement;
      
      if (element) {
        console.log(`Found element:`, element);
        
        // Save original styles to restore later
        const originalZIndex = element.style.zIndex;
        const originalPosition = element.style.position;
        const originalBgColor = element.style.backgroundColor;
        
        // Apply highlight styles
        setTargetElement(element);
        element.classList.add('walkthrough-highlight');
        
        // Force element visibility in case it's hidden by other styles
        element.style.position = element.style.position || 'relative';
        element.style.zIndex = '1000';
        
        // Set explicit background color if not already set
        if (!element.style.backgroundColor || element.style.backgroundColor === 'transparent') {
          element.style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
        }
        
        // Calculate position for tooltip after a short delay
        setTimeout(() => {
          // Make sure the element is visible in the viewport
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          updateTooltipPosition(element);
        }, 300);
        
        // Set up resize observer to update position if needed
        const resizeObserver = new ResizeObserver(() => {
          updateTooltipPosition(element);
        });
        
        resizeObserver.observe(element);
        
        // Add scroll listener
        const handleScroll = () => updateTooltipPosition(element);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
          // Restore original styles
          element.classList.remove('walkthrough-highlight');
          element.style.zIndex = originalZIndex;
          element.style.position = originalPosition;
          element.style.backgroundColor = originalBgColor;
          
          resizeObserver.disconnect();
          window.removeEventListener('scroll', handleScroll);
        };
      } else {
        console.error(`Element not found with selector: ${targetSelector}`);
        
        // Retry logic 
        if (retryRef.current < maxRetries) {
          console.log(`Retry attempt ${retryRef.current + 1}/${maxRetries}`);
          retryRef.current++;
          
          // Increase delay with each retry
          const retryDelay = 300 + (retryRef.current * 200);
          const retryTimeout = setTimeout(findElement, retryDelay);
          return () => clearTimeout(retryTimeout);
        } else {
          console.error(`Max retries (${maxRetries}) reached for finding element`);
          return undefined;
        }
      }
    };
    
    // Initial attempt to find element
    const cleanup = findElement();
    return cleanup;
  }, [targetSelector]);
  
  const updateTooltipPosition = (element: HTMLElement) => {
    if (!element) return;
    
    // Log element details
    const display = window.getComputedStyle(element).display;
    const visibility = window.getComputedStyle(element).visibility;
    const opacity = window.getComputedStyle(element).opacity;
    
    console.log(`Element styles - display: ${display}, visibility: ${visibility}, opacity: ${opacity}`);
    
    const rect = element.getBoundingClientRect();
    console.log(`Element position: top=${rect.top}, left=${rect.left}, bottom=${rect.bottom}, right=${rect.right}, width=${rect.width}, height=${rect.height}`);
    
    // Add offset to the position based on the page scroll
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Get tooltip dimensions (use the ref if available, otherwise use estimates)
    const tooltipHeight = tooltipRef.current?.offsetHeight || 180;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 300;
    const spacing = 15; // Space between target and tooltip
    
    let top = 0;
    let left = 0;
    
    switch (placement) {
      case 'top':
        top = rect.top + scrollY - tooltipHeight - spacing;
        left = rect.left + scrollX + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'right':
        top = rect.top + scrollY + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + scrollX + spacing;
        break;
      case 'left':
        top = rect.top + scrollY + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left + scrollX - tooltipWidth - spacing;
        break;
      default: // bottom
        top = rect.bottom + scrollY + spacing;
        left = rect.left + scrollX + (rect.width / 2) - (tooltipWidth / 2);
        break;
    }
    
    // Keep tooltip within viewport
    if (left < scrollX + 20) left = scrollX + 20;
    if (left + tooltipWidth > scrollX + window.innerWidth - 20) {
      left = scrollX + window.innerWidth - tooltipWidth - 20;
    }
    
    if (top < scrollY + 20) top = scrollY + 20;
    if (top + tooltipHeight > scrollY + window.innerHeight - 20) {
      top = scrollY + window.innerHeight - tooltipHeight - 20;
    }
    
    console.log(`Setting tooltip position: top=${top}, left=${left}`);
    setTooltipPosition({ top, left });
  };
  
  if (!targetElement) {
    console.log('No target element found, not rendering walkthrough step');
    return null;
  }
  
  // Position the arrow based on placement
  const arrowPositionClasses = {
    top: 'bottom-[-6px] left-[calc(50%_-_5px)] border-t-0 border-l-0',
    right: 'left-[-6px] top-[calc(50%_-_5px)] border-b-0 border-l-0',
    left: 'right-[-6px] top-[calc(50%_-_5px)] border-t-0 border-r-0',
    bottom: 'top-[-6px] left-[calc(50%_-_5px)] border-b-0 border-r-0'
  };
  
  console.log('Rendering walkthrough step with theme:', isDarkMode ? 'dark' : 'light');
  
  return (
    <>
      {createPortal(
        <div 
          className="fixed inset-0 bg-black/60 z-[999] pointer-events-auto walkthrough-overlay" 
          onClick={e => e.stopPropagation()} 
        />,
        document.body
      )}
      
      {createPortal(
        <div 
          ref={tooltipRef}
          className="fixed w-[300px] z-[1000] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 walkthrough-tooltip"
          style={{ 
            position: 'absolute',
            top: tooltipPosition.top, 
            left: tooltipPosition.left,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', // Fully opaque colors
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div 
            className={twMerge(
              "absolute w-[10px] h-[10px] transform rotate-45 border border-gray-200 dark:border-gray-700 z-[-1]",
              arrowPositionClasses[placement]
            )}
            style={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
            }}
          />
          
          {title && (
            <h3 className="text-base font-semibold mb-1">{title}</h3>
          )}
          
          <p className="text-sm mb-4">{content}</p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-soil-500 dark:text-soil-400">
              Step {stepNumber} of {totalSteps}
            </div>
            
            <div className="flex space-x-2">
              {!isFirstStep && onPrev && (
                <Button type="button" variant="secondary" onClick={onPrev} className="px-3 py-1.5 text-xs font-medium">
                  Previous
                </Button>
              )}
              <Button type="button" onClick={onNext} className="px-3 py-1.5 text-xs font-medium">
                {isLastStep ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
            aria-label="Skip walkthrough"
            className="absolute top-2 right-2 text-base flex items-center justify-center w-6 h-6 min-w-0 p-0"
          >
            ×
          </Button>
        </div>,
        document.body
      )}
    </>
  );
};

export default WalkthroughStep; 