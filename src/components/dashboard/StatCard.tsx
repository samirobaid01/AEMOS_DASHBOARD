import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';

interface StatCardProps {
  name: string;
  count: number;
  path: string;
  icon: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  name,
  count,
  path,
  icon,
  color,
}) => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let requiredPermission: string | null = null;
    if (path === '/organizations') requiredPermission = 'organization.view';
    else if (path === '/areas') requiredPermission = 'area.view';
    else if (path === '/devices') requiredPermission = 'device.view';
    else if (path === '/sensors') requiredPermission = 'sensor.view';

    if (requiredPermission && !hasPermission(requiredPermission)) {
      alert(`You don't have permission to access ${name}. Required permission: ${requiredPermission}`);
      return;
    }
    navigate(path);
  };

  return (
    <div
      onClick={handleClick}
      className="flex overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-primary dark:hover:border-primary-dark transition-all duration-300 h-full cursor-pointer"
      data-walkthrough="stat-card"
    >
      <div className={`w-2 shrink-0 ${color}`} />
      <div className="p-5 w-full">
        <div className="flex items-center">
          <div
            className={`shrink-0 rounded-lg p-2.5 flex items-center justify-center w-12 h-12 text-white text-2xl ${color}`}
          >
            {icon}
          </div>
          <div className="ml-5 flex-1 min-w-0">
            <h3 className="text-sm font-medium text-textMuted dark:text-textMuted-dark m-0 mb-2">
              {name}
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-textPrimary dark:text-textPrimary-dark m-0">
              {count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
