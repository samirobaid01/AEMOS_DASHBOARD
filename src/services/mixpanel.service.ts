import mixpanel from 'mixpanel-browser';
import { ENABLE_MIXPANEL, MIXPANEL_TOKEN, IS_PROD } from '../config';

// Initialize mixpanel
if (ENABLE_MIXPANEL && MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, { 
    debug: !IS_PROD,
    track_pageview: true,
    persistence: 'localStorage'
  });
  
  if (!IS_PROD) {
    console.log('Mixpanel initialized');
  }
}

/**
 * Track an event in Mixpanel
 */
export const track = (eventName: string, properties?: Record<string, any>) => {
  if (ENABLE_MIXPANEL && MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties);
    
    if (!IS_PROD) {
      console.log(`Mixpanel Event: ${eventName}`, properties);
    }
  }
};

/**
 * Identify a user in Mixpanel
 */
export const identify = (userId: string | number) => {
  if (ENABLE_MIXPANEL && MIXPANEL_TOKEN) {
    mixpanel.identify(String(userId));
  }
};

/**
 * Set user properties in Mixpanel
 */
export const setPeople = (properties: Record<string, any>) => {
  if (ENABLE_MIXPANEL && MIXPANEL_TOKEN) {
    mixpanel.people.set(properties);
  }
};

/**
 * Track page view in Mixpanel
 */
export const trackPageView = (pageName: string) => {
  track('Page View', { page: pageName });
};

/**
 * Reset the Mixpanel user
 */
export const reset = () => {
  if (ENABLE_MIXPANEL && MIXPANEL_TOKEN) {
    mixpanel.reset();
  }
};

// Export Mixpanel service
const MixpanelService = {
  track,
  identify,
  setPeople,
  trackPageView,
  reset
};

export default MixpanelService; 