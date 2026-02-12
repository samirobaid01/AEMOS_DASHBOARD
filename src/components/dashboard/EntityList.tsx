import React from 'react';
import { Link } from 'react-router-dom';

export interface Entity {
  id: string | number;
  name: string;
  status?: string | boolean;
  [key: string]: any;
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
  buttonColor,
  buttonHoverColor,
  addNewText,
  viewAllText,
  createNewText,
  noDetailsText
}) => {
  const hoverClass = hoverColor.replace(/^bg-/, 'hover:bg-');
  const buttonHoverClass = buttonHoverColor.replace(/^text-/, 'hover:text-');

  return (
    <div
      className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-md hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden"
      data-walkthrough="entity-list"
    >
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl text-white ${headerColor}`}>
        <h2 className="text-sm sm:text-base font-bold flex items-center m-0">
          <span className="mr-2">{titleIcon}</span>
          {title}
        </h2>
        {entities.length > 0 && (
          <Link
            to={createPath}
            className={`text-xs font-medium py-1 px-2 rounded-lg bg-white/20 text-white no-underline transition-opacity hover:opacity-90`}
          >
            + {addNewText}
          </Link>
        )}
      </div>

      {entities.length > 0 ? (
        <div className="p-3 flex-1 flex flex-col bg-card dark:bg-card-dark">
          <ul className="m-0 p-0 list-none flex-1">
            {entities.slice(0, 5).map((entity, index) => (
              <li
                key={entity.id}
                className={`py-3 ${index < Math.min(5, entities.length) - 1 ? 'border-b border-border dark:border-border-dark' : ''}`}
              >
                <Link
                  to={`${basePath}/${entity.id}`}
                  className={`flex items-center p-2 rounded-lg no-underline transition-colors ${hoverClass} bg-transparent`}
                >
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center mr-3 text-white text-lg shrink-0 ${headerColor}`}
                  >
                    {entityIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-textPrimary dark:text-textPrimary-dark m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {entity.name}
                    </p>
                    {detailField && (
                      <p className="text-xs text-textMuted dark:text-textMuted-dark mt-1 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                        {entity[detailField] || noDetailsText}
                      </p>
                    )}
                  </div>
                  <div
                    className={`ml-3 shrink-0 rounded-full h-3 w-3 ${
                      entity.status === true || entity.status === 'active' || entity.status === 'pending'
                        ? 'bg-success dark:bg-success-dark'
                        : 'bg-danger dark:bg-danger-dark'
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
          {entities.length > 5 && (
            <div className="mt-4 pt-4 border-t border-border dark:border-border-dark text-right">
              <Link
                to={basePath}
                className={`inline-flex items-center text-sm font-medium no-underline transition-colors ${buttonColor} ${buttonHoverClass}`}
              >
                {viewAllText}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 flex-1 bg-card dark:bg-card-dark text-textMuted dark:text-textMuted-dark">
          <span className="text-5xl mb-5">{entityIcon}</span>
          <p className="text-center text-sm m-0 mb-6">{emptyMessage}</p>
          <Link
            to={createPath}
            className={`inline-block py-2.5 px-5 rounded-lg text-sm font-medium no-underline text-white transition-colors ${headerColor}`}
          >
            {createNewText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EntityList;
