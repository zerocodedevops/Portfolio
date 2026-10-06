const GTM_ID = 'GTM-P8CDP9X6';

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function initGoogleTagManager() {
  if (!import.meta.env.PROD || document.querySelector(`script[data-gtm="${GTM_ID}"]`)) {
    return;
  }

  const tagWindow = window as WindowWithDataLayer;
  const dataLayer = (tagWindow.dataLayer = tagWindow.dataLayer || []);
  dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.dataset.gtm = GTM_ID;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}
