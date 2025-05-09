import React, { useEffect, useRef, useCallback } from 'react';
import { useWalkthrough } from '../../context/WalkthroughContext';
import Walkthrough, { createWalkthrough } from '../common/Walkthrough';

const DASHBOARD_WALKTHROUGH_ID = 'dashboard-walkthrough';

// Create the walkthrough definition once outside the component
const dashboardWalkthrough = createWalkthrough(DASHBOARD_WALKTHROUGH_ID, [
  {
    target: '[data-walkthrough="dashboard-header"]',
    title: 'Dashboard Header',
    content: 'This is the header of your dashboard. It shows you the current section and provides quick access to actions.',
    placement: 'bottom'
  },
  {
    target: '[data-walkthrough="stat-card"]:first-child',
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
  const { 
    registerWalkthrough, 
    hasSeenWalkthrough: checkHasSeenWalkthrough, 
    isWalkthroughEnabled, 
    startWalkthrough,
    walkthroughs,
    isWalkthroughActive
  } = useWalkthrough();
  
  const hasRegisteredRef = useRef(false);
  const hasStartedRef = useRef(false);
  const hasCheckedRef = useRef(false);
  const retryCountRef = useRef(0);
  
  // Stabilize function calls with useCallback to prevent unnecessary re-renders
  const hasSeenWalkthrough = useCallback(() => {
    return checkHasSeenWalkthrough(DASHBOARD_WALKTHROUGH_ID);
  }, [checkHasSeenWalkthrough]);
  
  // First effect: Register the walkthrough once and only once
  useEffect(() => {
    if (!hasRegisteredRef.current) {
      console.log('Registering dashboard walkthrough');
      registerWalkthrough(dashboardWalkthrough);
      hasRegisteredRef.current = true;
    }
  }, [registerWalkthrough]);
  
  // Debug effect: Log walkthroughs state
  useEffect(() => {
    console.log('Registered walkthroughs:', walkthroughs);
    console.log('Walkthrough active state:', isWalkthroughActive);
    console.log(`Is ${DASHBOARD_WALKTHROUGH_ID} in walkthroughs:`, !!walkthroughs[DASHBOARD_WALKTHROUGH_ID]);
  }, [walkthroughs, isWalkthroughActive]);
  
  // Function to check if all target elements exist in the DOM
  const allTargetsExist = useCallback(() => {
    const allExist = dashboardWalkthrough.steps.every(step => {
      const el = document.querySelector(step.target);
      const exists = !!el;
      console.log(`Target ${step.target} exists:`, exists);
      return exists;
    });
    
    return allExist;
  }, []);
  
  // Second effect: Start the walkthrough if conditions are met
  useEffect(() => {
    // Skip if we've already started
    if (hasStartedRef.current) return;
    
    // Don't run this effect if registration hasn't happened yet
    if (!hasRegisteredRef.current) return;
    
    // Mark that we're checking
    hasCheckedRef.current = true;
    
    console.log('DashboardWalkthrough checking if should start');
    console.log('Walkthrough enabled:', isWalkthroughEnabled);
    console.log('Has seen walkthrough:', hasSeenWalkthrough());
    
    // Check if the walkthrough should be started after a delay
    // to ensure all components have been mounted
    const timer = setTimeout(() => {
      const shouldStart = isWalkthroughEnabled && !hasSeenWalkthrough();
      const targetsExist = allTargetsExist();
      
      console.log('Should start walkthrough?', shouldStart);
      console.log('All targets exist?', targetsExist);
      
      if (shouldStart && targetsExist) {
        console.log('Starting walkthrough automatically');
        hasStartedRef.current = true;
        startWalkthrough(DASHBOARD_WALKTHROUGH_ID);
      } else if (shouldStart && !targetsExist && retryCountRef.current < 5) {
        // Retry a few times if targets don't exist yet
        console.log(`Retry attempt ${retryCountRef.current + 1} for walkthrough`);
        retryCountRef.current++;
        hasCheckedRef.current = false; // Allow rechecking
      }
    }, 2000); // Increased delay to ensure DOM is fully rendered
    
    return () => clearTimeout(timer);
  }, [isWalkthroughEnabled, hasSeenWalkthrough, startWalkthrough, allTargetsExist]);
  
  return <Walkthrough id={DASHBOARD_WALKTHROUGH_ID} />;
};

export default DashboardWalkthrough; 