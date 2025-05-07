import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-soft rounded-xl border border-leaf-100 overflow-hidden h-full">
      <div className={`${headerColor} text-white px-6 py-4 flex items-center justify-between`}>
        <h2 className="text-lg font-bold flex items-center">
          <span className="mr-2">{titleIcon}</span> {title}
        </h2>
        {entities.length > 0 && (
          <Link 
            to={createPath} 
            className={`bg-white ${buttonColor} hover:${hoverColor} text-xs font-medium px-3 py-1 rounded-lg transition-colors duration-200`}
          >
            + {t('add_new')}
          </Link>
        )}
      </div>
      
      {entities.length > 0 ? (
        <div className="p-4">
          <ul className={`divide-y ${dividerColor}`}>
            {entities.slice(0, 5).map((entity) => (
              <li key={entity.id} className="py-3 first:pt-0 last:pb-0">
                <Link 
                  to={`${basePath}/${entity.id}`} 
                  className={`flex items-center hover:${hoverColor} p-2 rounded-lg transition-colors duration-200`}
                >
                  <div className={`h-8 w-8 rounded-lg ${headerColor} text-white flex items-center justify-center mr-3 text-lg`}>
                    {entityIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-md font-semibold text-soil-800 truncate">{entity.name}</p>
                    {detailField && (
                      <p className="text-sm text-soil-500 truncate">
                        {entity[detailField] || t('no_details')}
                      </p>
                    )}
                  </div>
                  <div className={`ml-4 flex-shrink-0 rounded-full h-3 w-3 ${entity.status ? 'bg-leaf-500' : 'bg-red-500'}`}></div>
                </Link>
              </li>
            ))}
          </ul>
          {entities.length > 5 && (
            <div className={`mt-4 border-t ${dividerColor} pt-4`}>
              <Link 
                to={basePath} 
                className={`text-sm font-medium ${buttonColor} hover:${buttonHoverColor} transition-colors duration-200 flex items-center`}
              >
                {t('view_all')}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-soil-500 px-4">
          <span className="text-4xl mb-3">{entityIcon}</span>
          <p className="text-center">{emptyMessage}</p>
          <Link 
            to={createPath} 
            className={`mt-4 ${headerColor} text-white hover:${buttonHoverColor} px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium`}
          >
            {t('create_new')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EntityList; 