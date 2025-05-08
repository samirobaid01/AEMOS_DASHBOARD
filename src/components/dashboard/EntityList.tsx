import React from 'react';
import { Link } from 'react-router-dom';

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
    backgroundColor: 'white',
    color: buttonColor.replace('text-', ''),
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    transition: 'color 0.2s',
    textDecoration: 'none',
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      height: '100%',
      transition: 'box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }}
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
          flexDirection: 'column'
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
                borderBottom: index !== entities.slice(0, 5).length - 1 ? `1px solid ${dividerColor.replace('divide-', '')}` : 'none'
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
                    e.currentTarget.style.backgroundColor = hoverColor.replace('hover:bg-', '');
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
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{entity.name}</p>
                    {detailField && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        margin: '0.25rem 0 0 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
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
                    backgroundColor: entity.status ? '#16a34a' : '#ef4444'
                  }}></div>
                </Link>
              </li>
            ))}
          </ul>
          {entities.length > 5 && (
            <div style={{
              marginTop: '1rem',
              borderTop: `1px solid ${dividerColor.replace('divide-', '')}`,
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
          color: '#6B7280',
          flex: 1
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