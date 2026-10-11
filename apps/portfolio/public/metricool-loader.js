(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('zerocode-cookie-consent-v1') || 'null');
    if (saved?.necessary !== true || saved?.analytics !== true) return;
  } catch {
    return;
  }

  if (window.__zerocodeMetricoolLoaded) return;
  window.__zerocodeMetricoolLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://tracker.metricool.com/resources/be.js';
  script.onload = () => {
    if (window.beTracker?.t) {
      window.beTracker.t({ hash: '4caca2eb12ab311411265cf869ca3773' });
    }
  };
  script.onerror = () => {
    window.__zerocodeMetricoolLoaded = false;
  };
  document.head.appendChild(script);
})();
