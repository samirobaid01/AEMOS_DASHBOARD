import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

interface WalkthroughStep {
  target: string;
  content: string;
  title?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export interface Walkthrough {
  id: string;
  steps: WalkthroughStep[];
}

interface WalkthroughContextType {
  isWalkthroughEnabled: boolean;
  toggleWalkthroughEnabled: () => void;
  isWalkthroughActive: boolean;
  activeWalkthrough: Walkthrough | null;
  currentStepIndex: number;
  startWalkthrough: (walkthroughId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeWalkthrough: () => void;
  skipWalkthrough: () => void;
  registerWalkthrough: (walkthrough: Walkthrough) => void;
  walkthroughs: Record<string, Walkthrough>;
  hasSeenWalkthrough: (walkthroughId: string) => boolean;
  resetCompletedWalkthroughs: () => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
};

interface WalkthroughProviderProps {
  children: ReactNode;
}

export const WalkthroughProvider: React.FC<WalkthroughProviderProps> = ({ children }) => {
  const [isWalkthroughEnabled, setIsWalkthroughEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('walkthrough_enabled');
    return saved !== null ? saved === 'true' : true; // Default to true if not set
  });
  
  const [walkthroughs, setWalkthroughs] = useState<Record<string, Walkthrough>>({});
  const [activeWalkthrough, setActiveWalkthrough] = useState<Walkthrough | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState<boolean>(false);
  const activeWalkthroughRef = useRef<string | null>(null);
  
  // Load completed walkthroughs from localStorage
  const [completedWalkthroughs, setCompletedWalkthroughs] = useState<string[]>(() => {
    const saved = localStorage.getItem('completed_walkthroughs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save completed walkthroughs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('completed_walkthroughs', JSON.stringify(completedWalkthroughs));
  }, [completedWalkthroughs]);
  
  // Save walkthrough enabled state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('walkthrough_enabled', isWalkthroughEnabled.toString());
  }, [isWalkthroughEnabled]);
  
  // Use refs to store stable versions of functions
  const resetCompletedWalkthroughs = useCallback(() => {
    setCompletedWalkthroughs([]);
    localStorage.setItem('completed_walkthroughs', JSON.stringify([]));
    console.log('Completed walkthroughs reset');
  }, []);
  
  const toggleWalkthroughEnabled = useCallback(() => {
    setIsWalkthroughEnabled(prev => {
      // If we're turning on walkthroughs, reset the completed walkthroughs
      if (!prev) {
        resetCompletedWalkthroughs();
      }
      return !prev;
    });
  }, [resetCompletedWalkthroughs]);
  
  const registerWalkthrough = useCallback((walkthrough: Walkthrough) => {
    // Check if this walkthrough is already registered to prevent unnecessary updates
    setWalkthroughs(prev => {
      if (prev[walkthrough.id]) {
        // If it's already in the state and nothing changed, return the same state object
        // to prevent unnecessary rerenders
        return prev;
      }
      return {
        ...prev,
        [walkthrough.id]: walkthrough
      };
    });
  }, []);
  
  const hasSeenWalkthrough = useCallback((walkthroughId: string) => {
    return completedWalkthroughs.includes(walkthroughId);
  }, [completedWalkthroughs]);
  
  const startWalkthrough = useCallback((walkthroughId: string) => {
    // Don't start if already active or not enabled
    if (!isWalkthroughEnabled || hasSeenWalkthrough(walkthroughId) || isWalkthroughActive || activeWalkthroughRef.current === walkthroughId) {
      return;
    }
    
    const walkthrough = walkthroughs[walkthroughId];
    if (walkthrough) {
      console.log(`Starting walkthrough: ${walkthroughId}`);
      
      // Check if the first target element exists before starting
      const firstStep = walkthrough.steps[0];
      const firstTarget = document.querySelector(firstStep.target);
      
      if (!firstTarget) {
        console.error(`Cannot start walkthrough: target element not found for selector "${firstStep.target}"`);
        return;
      }
      
      activeWalkthroughRef.current = walkthroughId;
      setActiveWalkthrough(walkthrough);
      setCurrentStepIndex(0);
      setIsWalkthroughActive(true);
    }
  }, [isWalkthroughEnabled, hasSeenWalkthrough, walkthroughs, isWalkthroughActive]);
  
  const nextStep = useCallback(() => {
    if (activeWalkthrough && currentStepIndex < activeWalkthrough.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // If we're at the last step, close the walkthrough
      if (activeWalkthrough) {
        setCompletedWalkthroughs(prev => [...prev, activeWalkthrough.id]);
      }
      setIsWalkthroughActive(false);
      setActiveWalkthrough(null);
      setCurrentStepIndex(0);
      activeWalkthroughRef.current = null;
    }
  }, [activeWalkthrough, currentStepIndex]);
  
  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);
  
  const closeWalkthrough = useCallback(() => {
    if (activeWalkthrough) {
      setCompletedWalkthroughs(prev => [...prev, activeWalkthrough.id]);
    }
    setIsWalkthroughActive(false);
    setActiveWalkthrough(null);
    setCurrentStepIndex(0);
    activeWalkthroughRef.current = null;
  }, [activeWalkthrough]);
  
  const skipWalkthrough = useCallback(() => {
    if (activeWalkthrough) {
      setCompletedWalkthroughs(prev => [...prev, activeWalkthrough.id]);
    }
    setIsWalkthroughActive(false);
    setActiveWalkthrough(null);
    setCurrentStepIndex(0);
    activeWalkthroughRef.current = null;
  }, [activeWalkthrough]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = {
    isWalkthroughEnabled,
    toggleWalkthroughEnabled,
    isWalkthroughActive,
    activeWalkthrough,
    currentStepIndex,
    startWalkthrough,
    nextStep,
    prevStep,
    closeWalkthrough,
    skipWalkthrough,
    registerWalkthrough,
    walkthroughs,
    hasSeenWalkthrough,
    resetCompletedWalkthroughs,
  };
  
  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
};

// Need to export as a named export to avoid Fast Refresh issues
export { WalkthroughContext }; 