import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface Entity {
  id: string | number;
  name: string;
  status?: boolean;
  [key: string]: any; // For any additional properties
}

interface EntityListProps {
  title: string;
  titleIcon: string;
  entities: Entity[];
  entityIcon: string;
  emptyMessage: string;
  basePath: string;
  createPath: string;
  detailField?: string;
  headerColor: string;
  hoverColor: string;
  dividerColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  addNewText: string;
  viewAllText: string;
  createNewText: string;
  noDetailsText: string;
}

const EntityList: React.FC<EntityListProps> = ({
  title,
  titleIcon,
  entities,
  entityIcon,
  emptyMessage,
  basePath,
  createPath,
  detailField,
  headerColor,
  hoverColor,
  dividerColor,
  buttonColor,
  buttonHoverColor,
  addNewText,
  viewAllText,
  createNewText,
  noDetailsText
}) => {
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  const headerStyle = {
    backgroundColor: headerColor.replace('bg-', ''),
    color: 'white',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: '0.75rem',
    borderTopRightRadius: '0.75rem',
  };
  
  const titleStyle = {
    fontSize: 'calc(0.9rem + 0.1vw)',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  };
  
  const addButtonStyle = {
    backgroundColor: darkMode ? colors.surfaceBackground : 'white',
    color: buttonColor.replace('text-', ''),
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    transition: 'color 0.2s',
    textDecoration: 'none',
  };

  const getItemTextStyle = (isPrimary: boolean) => ({
    fontSize: isPrimary ? '0.875rem' : '0.75rem',
    fontWeight: isPrimary ? '600' : '400',
    color: isPrimary 
      ? (darkMode ? colors.textPrimary : '#374151') 
      : (darkMode ? colors.textMuted : '#6B7280'),
    margin: isPrimary ? 0 : '0.25rem 0 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  });
  
  return (
    <div style={{
      backgroundColor: darkMode ? colors.cardBackground : 'white',
      boxShadow: darkMode 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: '0.75rem',
      border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
      overflow: 'hidden',
      height: '100%',
      transition: 'box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = darkMode
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = darkMode
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }}
    data-walkthrough="entity-list"
    >
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <span style={{ marginRight: '0.5rem' }}>{titleIcon}</span> {title}
        </h2>
        {entities.length > 0 && (
          <Link 
            to={createPath} 
            style={addButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = buttonHoverColor.replace('text-', '');
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = buttonColor.replace('text-', '');
            }}
          >
            + {addNewText}
          </Link>
        )}
      </div>
      
      {entities.length > 0 ? (
        <div style={{ 
          padding: '0.75rem 1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: darkMode ? colors.cardBackground : 'white',
        }}>
          <ul style={{ 
            margin: 0,
            padding: 0,
            listStyle: 'none',
            flex: 1
          }}>
            {entities.slice(0, 5).map((entity, index) => (
              <li key={entity.id} style={{ 
                padding: index === 0 ? '0 0 0.75rem 0' : 
                       index === entities.slice(0, 5).length - 1 ? '0.75rem 0 0 0' : '0.75rem 0',
                borderBottom: index !== entities.slice(0, 5).length - 1 
                  ? `1px solid ${darkMode ? colors.divider : dividerColor.replace('divide-', '')}`
                  : 'none'
              }}>
                <Link 
                  to={`${basePath}/${entity.id}`} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode 
                      ? colors.surfaceBackground
                      : hoverColor.replace('hover:bg-', '');
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    height: '2.25rem',
                    width: '2.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: headerColor.replace('bg-', ''),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.75rem',
                    fontSize: '1.125rem'
                  }}>
                    {entityIcon}
                  </div>
                  <div style={{
                    minWidth: 0,
                    flex: 1
                  }}>
                    <p style={getItemTextStyle(true)}>{entity.name}</p>
                    {detailField && (
                      <p style={getItemTextStyle(false)}>
                        {entity[detailField] || noDetailsText}
                      </p>
                    )}
                  </div>
                  <div style={{
                    marginLeft: '0.75rem',
                    flexShrink: 0,
                    borderRadius: '9999px',
                    height: '0.75rem',
                    width: '0.75rem',
                    backgroundColor: entity.status 
                      ? (darkMode ? colors.success : '#16a34a')
                      : (darkMode ? colors.danger : '#ef4444')
                  }}></div>
                </Link>
              </li>
            ))}
          </ul>
          {entities.length > 5 && (
            <div style={{
              marginTop: '1rem',
              borderTop: `1px solid ${darkMode ? colors.divider : dividerColor.replace('divide-', '')}`,
              paddingTop: '1rem',
              textAlign: 'right'
            }}>
              <Link 
                to={basePath} 
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: buttonColor.replace('text-', ''),
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = buttonHoverColor.replace('text-', '');
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = buttonColor.replace('text-', '');
                }}
              >
                {viewAllText}
                <svg style={{ marginLeft: '0.25rem', width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          color: darkMode ? colors.textMuted : '#6B7280',
          flex: 1,
          backgroundColor: darkMode ? colors.cardBackground : 'white',
        }}>
          <span style={{
            fontSize: '3rem',
            marginBottom: '1.25rem'
          }}>{entityIcon}</span>
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            margin: '0 0 1.5rem 0'
          }}>{emptyMessage}</p>
          <Link 
            to={createPath} 
            style={{
              backgroundColor: headerColor.replace('bg-', ''),
              color: 'white',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverColor.replace('hover:bg-', '');
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = headerColor.replace('bg-', '');
            }}
          >
            {createNewText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EntityList; 