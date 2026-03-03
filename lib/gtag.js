export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const isGaEnabled = Boolean(GA_MEASUREMENT_ID);

export function pageview(url) {
  if (!isGaEnabled || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function event({ action, category, label, value, ...params }) {
  if (!isGaEnabled || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...params,
  });
}
