export const COOKIE_CONSENT_KEY = 'zerocode-cookie-consent-v1';

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  savedAt: string;
}

export function readCookieConsent(): CookieConsent | null {
  try {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    if (
      typeof parsed !== 'object' || parsed === null ||
      !('necessary' in parsed) || parsed.necessary !== true ||
      !('analytics' in parsed) || typeof parsed.analytics !== 'boolean'
    ) return null;
    return parsed as CookieConsent;
  } catch {
    return null;
  }
}

export function saveCookieConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // If the browser blocks storage, readCookieConsent() keeps optional tags disabled.
  }
  window.dispatchEvent(new CustomEvent('zerocode:cookie-consent', { detail: consent }));
  return consent;
}
