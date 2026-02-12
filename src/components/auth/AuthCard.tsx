import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string | React.ReactNode;
  icon?: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  icon = '🌾',
  children
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-leaf-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full mx-auto bg-card dark:bg-card-dark rounded-2xl shadow-lg p-6 border border-leaf-200 dark:border-border-dark transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary-dark mb-2">
            AEMOS <span className="text-warning dark:text-warning-dark">Agriculture</span>
          </h1>
          <div className="text-3xl sm:text-4xl mb-3">
            {icon}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-soil-800 dark:text-textPrimary-dark">
            {title}
          </h2>
          {subtitle && (
            <div className="mt-2 text-sm text-soil-700 dark:text-textMuted-dark">
              {subtitle}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
