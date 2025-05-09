import React from 'react';
import { useWalkthrough } from '../../../context/WalkthroughContext';

interface WalkthroughTriggerProps {
  walkthroughId: string;
  className?: string;
  buttonStyle?: 'icon' | 'button' | 'text';
  label?: string;
  iconOnly?: boolean;
  tooltip?: string;
}

const WalkthroughTrigger: React.FC<WalkthroughTriggerProps> = ({
  walkthroughId,
  className = '',
  buttonStyle = 'icon',
  label = 'Help',
  iconOnly = true,
  tooltip = 'Start guided tour'
}) => {
  const { startWalkthrough, resetCompletedWalkthroughs } = useWalkthrough();
  
  const handleStartWalkthrough = () => {
    // Reset if needed and start the specified walkthrough
    resetCompletedWalkthroughs();
    startWalkthrough(walkthroughId);
  };
  
  // Different style options for the trigger
  if (buttonStyle === 'button') {
    return (
      <button
        onClick={handleStartWalkthrough}
        className={`px-3 py-1.5 text-xs font-medium rounded-md bg-leaf-600 hover:bg-leaf-700 text-white flex items-center ${className}`}
        title={tooltip}
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {label}
      </button>
    );
  }
  
  if (buttonStyle === 'text') {
    return (
      <button
        onClick={handleStartWalkthrough}
        className={`text-leaf-600 hover:text-leaf-800 dark:text-leaf-500 dark:hover:text-leaf-400 text-sm flex items-center ${className}`}
        title={tooltip}
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {label}
      </button>
    );
  }
  
  // Default icon style
  return (
    <button
      onClick={handleStartWalkthrough}
      className={`text-gray-500 hover:text-leaf-600 dark:text-gray-400 dark:hover:text-leaf-500 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      title={tooltip}
      aria-label={label}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {!iconOnly && <span className="ml-1.5">{label}</span>}
    </button>
  );
};

export default WalkthroughTrigger; 