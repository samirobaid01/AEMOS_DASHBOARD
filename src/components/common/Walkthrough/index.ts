export { default } from './Walkthrough';
export { default as WalkthroughStep } from './WalkthroughStep';
export { default as WalkthroughTrigger } from './WalkthroughTrigger';

// Helper function to create a walkthrough
export const createWalkthrough = (id: string, steps: Array<{
  target: string;
  content: string;
  title?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}>) => {
  return {
    id,
    steps
  };
}; 