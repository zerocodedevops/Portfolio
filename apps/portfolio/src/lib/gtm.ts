const GTM_CONTAINER_ID = 'GTM-P8CDP9X6';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Loads the container only after the visitor has opted into analytics. */
export function loadGoogleTagManager() {
  if (document.querySelector('script[data-zerocode-gtm="true"]')) return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.dataset.zerocodeGtm = 'true';
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
}
