import React from 'react';
import { LayoutDashboard, type LucideIcon } from 'lucide-react';
import WalkthroughTrigger from '../common/Walkthrough/WalkthroughTrigger';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  walkthroughId?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  icon: Icon = LayoutDashboard,
  walkthroughId = 'dashboard-walkthrough',
}) => {
  return (
    <div
      className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-border dark:border-border-dark"
      data-walkthrough="dashboard-header"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
          <Icon className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <WalkthroughTrigger
          walkthroughId={walkthroughId}
          tooltip="Start guided tour"
          buttonStyle="button"
          label="Tour"
          iconOnly={false}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
