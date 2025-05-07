import React from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  title: string;
  icon?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  icon = '🌱' 
}) => {
  const { t } = useTranslation();

  return (
    <h1 className="text-3xl font-bold text-soil-800 mb-8 flex items-center">
      <span className="text-2xl mr-3">{icon}</span> {t(title)}
    </h1>
  );
};

export default DashboardHeader; 