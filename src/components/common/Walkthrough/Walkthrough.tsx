import React, { useEffect } from 'react';
import { useWalkthrough } from '../../../context/WalkthroughContext';
import WalkthroughStep from './WalkthroughStep';

interface WalkthroughProps {
  id: string;
  autoStart?: boolean;
}

const Walkthrough: React.FC<WalkthroughProps> = ({ 
  id,
  autoStart = false // Default to false, let parent components control starting
}) => {
  const { 
    isWalkthroughActive,
    activeWalkthrough,
    currentStepIndex,
    nextStep,
    prevStep,
    skipWalkthrough,
    startWalkthrough,
    hasSeenWalkthrough,
    isWalkthroughEnabled
  } = useWalkthrough();

  // Only auto-start if specifically enabled for this walkthrough instance
  useEffect(() => {
    if (autoStart && !hasSeenWalkthrough(id) && isWalkthroughEnabled) {
      // Small delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        startWalkthrough(id);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [id, hasSeenWalkthrough, isWalkthroughEnabled, autoStart]);

  // Don't render anything if walkthrough is not active or not for this ID
  if (!isWalkthroughActive || !activeWalkthrough || activeWalkthrough.id !== id) {
    return null;
  }

  const currentStep = activeWalkthrough.steps[currentStepIndex];
  if (!currentStep) return null;
  
  return (
    <WalkthroughStep
      targetSelector={currentStep.target}
      title={currentStep.title}
      content={currentStep.content}
      placement={currentStep.placement}
      onNext={nextStep}
      onPrev={currentStepIndex > 0 ? prevStep : undefined}
      onSkip={skipWalkthrough}
      isFirstStep={currentStepIndex === 0}
      isLastStep={currentStepIndex === activeWalkthrough.steps.length - 1}
      stepNumber={currentStepIndex + 1}
      totalSteps={activeWalkthrough.steps.length}
    />
  );
};

export default Walkthrough; 