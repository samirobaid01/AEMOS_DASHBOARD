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
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom, #f0f9f1, #e0f2fe)',
      padding: '0 1rem'
    }}>
      <div style={{ 
        maxWidth: '28rem',
        width: '100%',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '1.5rem',
        border: '1px solid #dcf1df',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ 
            fontSize: 'calc(1.25rem + 0.5vw)',
            fontWeight: 'bold',
            color: '#3c9c50',
            marginBottom: '0.5rem'
          }}>AEMOS <span style={{ color: '#d9a31b' }}>Agriculture</span></h1>
          <div style={{ 
            fontSize: 'calc(2rem + 1vw)',
            marginBottom: '0.75rem'
          }}>{icon}</div>
          <h2 style={{ 
            fontSize: 'calc(1.1rem + 0.3vw)',
            fontWeight: 'bold',
            color: '#674c3c'
          }}>
            {title}
          </h2>
          {subtitle && (
            <div style={{ 
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#7d5c42'
            }}>
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