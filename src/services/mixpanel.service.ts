import mixpanel from 'mixpanel-browser';
import { MIXPANEL_TOKEN } from '../config';

// Initialize Mixpanel
if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage'
  });
} else {
  console.warn('Mixpanel token not found. Analytics will not be collected.');
}

/**
 * Track an event in Mixpanel
 */
export const track = (event: string, properties?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;
  
  try {
    mixpanel.track(event, properties);
  } catch (error) {
    console.error('Error tracking event in Mixpanel:', error);
  }
};

/**
 * Identify a user in Mixpanel
 */
export const identify = (userId: string | number) => {
  if (!MIXPANEL_TOKEN) return;
  
  try {
    mixpanel.identify(String(userId));
  } catch (error) {
    console.error('Error identifying user in Mixpanel:', error);
  }
};

/**
 * Set user properties in Mixpanel
 */
export const setPeople = (properties: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;
  
  try {
    mixpanel.people.set(properties);
  } catch (error) {
    console.error('Error setting people properties in Mixpanel:', error);
  }
};

/**
 * Track page view in Mixpanel
 */
export const trackPageView = (pageName: string) => {
  if (!MIXPANEL_TOKEN) return;
  
  try {
    mixpanel.track('Page View', { page: pageName });
  } catch (error) {
    console.error('Error tracking page view in Mixpanel:', error);
  }
};

/**
 * Reset user identity in Mixpanel
 */
export const reset = () => {
  if (!MIXPANEL_TOKEN) return;
  
  try {
    mixpanel.reset();
  } catch (error) {
    console.error('Error resetting Mixpanel:', error);
  }
};

const MixpanelService = {
  track,
  identify,
  setPeople,
  trackPageView,
  reset
};

export default MixpanelService; 