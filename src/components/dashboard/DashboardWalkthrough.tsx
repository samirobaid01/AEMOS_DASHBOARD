import React, { useEffect } from 'react';
import { useWalkthrough } from '../../context/WalkthroughContext';
import Walkthrough, { createWalkthrough } from '../common/Walkthrough';

const DASHBOARD_WALKTHROUGH_ID = 'dashboard-walkthrough';

const dashboardWalkthrough = createWalkthrough(DASHBOARD_WALKTHROUGH_ID, [
  {
    target: '[data-walkthrough="dashboard-header"]',
    title: 'Dashboard Header',
    content: 'This is the header of your dashboard. It shows you the current section and provides quick access to actions.',
    placement: 'bottom'
  },
  {
    target: '[data-walkthrough="stat-card"]',
    title: 'Statistics Cards',
    content: 'These cards display key metrics and statistics about your system at a glance.',
    placement: 'bottom'
  },
  {
    target: '[data-walkthrough="entity-list"]',
    title: 'Entity List',
    content: 'This section shows you a list of all the entities in your system. You can click on any of them to see more details.',
    placement: 'top'
  }
]);

const DashboardWalkthrough: React.FC = () => {
  const { registerWalkthrough } = useWalkthrough();
  
  useEffect(() => {
    registerWalkthrough(dashboardWalkthrough);
  }, []);
  
  return <Walkthrough id={DASHBOARD_WALKTHROUGH_ID} />;
};

export default DashboardWalkthrough; 