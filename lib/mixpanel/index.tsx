'use client';

import Cookies from 'js-cookie';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const isProd = process.env.ENV_TYPE === 'production';

const cookiesUserData = Cookies.get('userData')
  ? JSON.parse(Cookies.get('userData') || '')
  : null;

// Declare global mixpanel type
declare global {
  interface Window {
    mixpanel: any;
  }
}

export const identifyUser = (userId: string): void => {
  if (
    !MIXPANEL_TOKEN ||
    !isProd ||
    typeof window === 'undefined' ||
    !window.mixpanel
  )
    return;

  window.mixpanel.identify(userId);
};

const getUTMProps = () => {
  if (typeof window === 'undefined') return {};

  const allProps: Record<string, string> = {
    'UTM Source': localStorage.getItem('utm_source') || '',
    'UTM Medium': localStorage.getItem('utm_medium') || '',
    'UTM Campaign': localStorage.getItem('utm_campaign') || '',
    'UTM Term': localStorage.getItem('utm_term') || '',
    'First Name': cookiesUserData?.firstName || '',
    'Last Name': cookiesUserData?.lastName || '',
    Email: cookiesUserData?.email || '',
    Phone: cookiesUserData?.phone || '',
    'Phone Number': cookiesUserData?.phoneNumber || '',
    'User Id': cookiesUserData?.id || '',
  };

  // Filter out keys with empty string or falsy values
  const filteredProps: Record<string, string> = {};

  for (const key in allProps) {
    if (allProps[key]) {
      filteredProps[key] = allProps[key];
    }
  }

  return filteredProps;
};

export const initMixpanel = (): void => {
  if (
    !MIXPANEL_TOKEN ||
    !isProd ||
    typeof window === 'undefined' ||
    !window.mixpanel
  )
    return;

  window.mixpanel.init(MIXPANEL_TOKEN, {
    debug: !isProd,
    track_pageview: true,
  });

  if (cookiesUserData?.id) {
    identifyUser(cookiesUserData.id);
  }

  // Optionally register global UTM props for all future events
  window.mixpanel.register(getUTMProps());
};

export const trackEvent = (
  eventName: string,
  properties: Record<string, unknown> = {}
): void => {
  if (!MIXPANEL_TOKEN || !isProd || typeof window === 'undefined') return;

  const utmProps = getUTMProps();

  window.mixpanel.track(eventName, {
    ...utmProps,
    ...properties, // Custom props take precedence if keys overlap
  });
};

/**
 * Schedules trackEvent off the main thread to improve INP.
 * Use in click/input handlers so the UI responds immediately.
 */
export const trackEventDeferred = (
  eventName: string,
  properties: Record<string, unknown> = {}
): void => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => trackEvent(eventName, properties), {
      timeout: 3000,
    });
  } else {
    setTimeout(() => trackEvent(eventName, properties), 0);
  }
};

// Export the global mixpanel object for direct access if needed
export const getMixpanel = () => {
  if (typeof window !== 'undefined') {
    return window.mixpanel;
  }
  return null;
};
