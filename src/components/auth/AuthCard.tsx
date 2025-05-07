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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-leaf-50 to-soil-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 border border-leaf-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-leaf-600 mb-2">AEMOS <span className="text-wheat-500">Agriculture</span></h1>
          <div className="text-5xl mb-4">{icon}</div>
          <h2 className="text-2xl font-bold text-soil-800">
            {title}
          </h2>
          {subtitle && (
            <div className="mt-2 text-sm text-soil-600">
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