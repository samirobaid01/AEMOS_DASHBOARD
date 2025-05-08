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
    <h1 style={{
      fontSize: 'calc(1.5rem + 0.5vw)',
      fontWeight: 'bold',
      color: '#111827',
      marginTop: 0,
      marginBottom: 'calc(1.5rem + 1vw)',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem'
    }}>
      <span style={{ 
        fontSize: 'calc(1.25rem + 0.5vw)',
        marginRight: '0.75rem' 
      }}>{icon}</span> {t(title)}
    </h1>
  );
};

export default DashboardHeader; 