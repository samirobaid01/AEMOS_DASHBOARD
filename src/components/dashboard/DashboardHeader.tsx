import React from 'react';
import WalkthroughTrigger from '../common/Walkthrough/WalkthroughTrigger';

interface DashboardHeaderProps {
  title: string;
  icon?: string;
  walkthroughId?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  icon = '🌱',
  walkthroughId = 'dashboard-walkthrough'
}) => {
  return (
    <div
      className="bg-card dark:bg-card-dark shadow p-4 flex justify-between items-center mb-6 border-b border-border dark:border-border-dark pb-4"
      data-walkthrough="dashboard-header"
    >
      <h1 className="text-xl sm:text-2xl font-bold text-textPrimary dark:text-textPrimary-dark m-0 flex items-center pb-4 mb-4 border-b border-border dark:border-border-dark">
        <span className="text-lg sm:text-xl mr-3">{icon}</span>
        {title}
      </h1>
      <div className="flex items-center gap-2">
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
