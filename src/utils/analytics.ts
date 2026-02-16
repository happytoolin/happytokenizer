export interface AnalyticsEventParams {
  [key: string]: boolean | number | string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    trackEvent?: (eventName: string, params?: AnalyticsEventParams) => void;
  }
}

const sanitizeEventParams = (
  params: AnalyticsEventParams,
): AnalyticsEventParams => {
  const entries = Object.entries(params).filter(([, value]) => {
    return value !== "" && value !== undefined;
  });

  return Object.fromEntries(entries);
};

export const trackEvent = (
  eventName: string,
  params: AnalyticsEventParams = {},
): void => {
  if (typeof window === "undefined" || !eventName) {
    return;
  }

  const payload = sanitizeEventParams(params);

  if (typeof window.trackEvent === "function") {
    window.trackEvent(eventName, payload);
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
};
