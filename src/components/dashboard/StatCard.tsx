import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import usePermissions from '../../hooks/usePermissions';

interface StatCardProps {
  name: string;
  count: number;
  path: string;
  icon: LucideIcon;
  /** Accent background class, e.g. `bg-leaf-600` (categorical per entity type). */
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ name, count, path, icon: Icon, color }) => {
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
      className="group relative flex overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-leaf-400 dark:hover:border-leaf-500 transition-all duration-200 h-full cursor-pointer"
      data-walkthrough="stat-card"
    >
      <div className={`w-1.5 shrink-0 ${color}`} />
      <div className="p-5 w-full">
        <div className="flex items-start">
          <div className={`shrink-0 rounded-xl flex items-center justify-center w-11 h-11 text-white ${color}`}>
            <Icon className="w-5 h-5" aria-hidden />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-sm font-medium text-textMuted dark:text-textMuted-dark m-0 mb-1.5">
              {name}
            </h3>
            <p className="text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 tabular-nums">
              {count}
            </p>
          </div>
          <ArrowUpRight
            className="w-4 h-4 text-textMuted dark:text-textMuted-dark opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
