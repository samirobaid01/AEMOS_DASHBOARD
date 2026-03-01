import React from 'react';

interface SensorIconProps {
  className?: string;
}

const SensorIcon: React.FC<SensorIconProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      
      <path
        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      
      <path
        d="M17 7L19.5 4.5M19.5 4.5L22 7M19.5 4.5V9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      <path
        d="M22 12H17M17 12L19.5 9.5M17 12L19.5 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      <path
        d="M17 17L19.5 19.5M19.5 19.5L22 17M19.5 19.5V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
};

export default SensorIcon;
