import React, { createContext, useContext, useState, useEffect } from 'react';
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
  
  const toggleWalkthroughEnabled = () => {
    setIsWalkthroughEnabled(prev => !prev);
  };
  
  const registerWalkthrough = (walkthrough: Walkthrough) => {
    setWalkthroughs(prev => ({
      ...prev,
      [walkthrough.id]: walkthrough
    }));
  };
  
  const hasSeenWalkthrough = (walkthroughId: string) => {
    return completedWalkthroughs.includes(walkthroughId);
  };
  
  const startWalkthrough = (walkthroughId: string) => {
    if (!isWalkthroughEnabled || hasSeenWalkthrough(walkthroughId)) {
      return;
    }
    
    const walkthrough = walkthroughs[walkthroughId];
    if (walkthrough && !isWalkthroughActive) {
      setActiveWalkthrough(walkthrough);
      setCurrentStepIndex(0);
      setIsWalkthroughActive(true);
    }
  };
  
  const nextStep = () => {
    if (activeWalkthrough && currentStepIndex < activeWalkthrough.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      closeWalkthrough();
    }
  };
  
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const closeWalkthrough = () => {
    if (activeWalkthrough) {
      setCompletedWalkthroughs(prev => [...prev, activeWalkthrough.id]);
    }
    setIsWalkthroughActive(false);
    setActiveWalkthrough(null);
    setCurrentStepIndex(0);
  };
  
  const skipWalkthrough = () => {
    if (activeWalkthrough) {
      setCompletedWalkthroughs(prev => [...prev, activeWalkthrough.id]);
    }
    setIsWalkthroughActive(false);
    setActiveWalkthrough(null);
    setCurrentStepIndex(0);
  };
  
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
  };
  
  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
};

export default WalkthroughContext; 