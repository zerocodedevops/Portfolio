import { useEffect, useState } from 'react';
import { readCookieConsent, saveCookieConsent, type CookieConsent as Consent } from '@/lib/cookieConsent';

const MANAGE_EVENT = 'zerocode:manage-cookies';

function clearKnownAnalyticsCookies() {
  const knownCookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => /^(?:_ga(?:_|$)|_gid$|_gat(?:_|$)|_gac_|_gcl_)/.test(name));
  const domain = window.location.hostname;
  for (const name of knownCookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    if (domain.includes('.')) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}; SameSite=Lax`;
    }
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(() => readCookieConsent());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const previousConsent = readCookieConsent();
    clearKnownAnalyticsCookies();
    if (previousConsent?.analytics === true) {
      saveCookieConsent(false);
      window.location.reload();
      return;
    }
    const syncConsent = (event: Event) => {
      const next = (event as CustomEvent<Consent>).detail;
      setConsent(next);
      if (next.analytics) saveCookieConsent(false);
    };
    const openSettings = () => {
      setShowSettings(true);
    };
    window.addEventListener('zerocode:cookie-consent', syncConsent);
    window.addEventListener(MANAGE_EVENT, openSettings);
    return () => {
      window.removeEventListener('zerocode:cookie-consent', syncConsent);
      window.removeEventListener(MANAGE_EVENT, openSettings);
    };
  }, []);

  const choose = (allowAnalytics: boolean) => {
    const wasAllowed = readCookieConsent()?.analytics === true;
    const next = saveCookieConsent(false);
    setConsent(next);
    setShowSettings(false);
    if (allowAnalytics || wasAllowed) window.location.reload();
  };

  if (consent && !showSettings) return null;

  return (
    <aside
      aria-label="Preferencias de cookies"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-[200] mx-auto max-w-4xl border border-slate-300 bg-white p-5 text-slate-900 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
      role="dialog"
    >
      <h2 id="cookie-consent-title" className="text-lg font-bold">Tu privacidad importa</h2>
      <p className="mt-2 text-sm leading-6">
        Este sitio usa almacenamiento local para recordar el idioma y tu preferencia. Al empezar a rellenar el formulario,
        cargamos reCAPTCHA para reducir el spam; Google establece la cookie técnica _GRECAPTCHA. No usamos analítica,
        publicidad ni Google Tag Manager.
        Consulta la <a className="underline" href="/politica-de-cookies">política de cookies</a>.
      </p>
      {showSettings && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm"><strong>Necesarias:</strong> almacenamiento local para idioma y preferencia, y la cookie técnica de reCAPTCHA solo al usar el formulario. <strong>Opcionales:</strong> no hay categorías de analítica ni publicidad.</p>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {showSettings ? (
          <button className="border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-100" onClick={() => choose(false)} type="button">Guardar selección</button>
        ) : (
          <button className="border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-100" onClick={() => setShowSettings(true)} type="button">Configurar</button>
        )}
        {!showSettings && <button className="bg-sky-800 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-900" onClick={() => choose(false)} type="button">Entendido</button>}
      </div>
    </aside>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(MANAGE_EVENT));
}
