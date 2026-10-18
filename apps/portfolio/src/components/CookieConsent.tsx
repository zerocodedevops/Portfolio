import { useEffect, useRef, useState } from 'react';
import { readCookieConsent, saveCookieConsent, type CookieConsent as Consent } from '@/lib/cookieConsent';
import { loadGoogleTagManager } from '@/lib/gtm';

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
  const [allowAnalytics, setAllowAnalytics] = useState(() => readCookieConsent()?.analytics ?? false);
  const previousAnalytics = useRef(readCookieConsent()?.analytics ?? false);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    getFocusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSettings) {
        event.preventDefault();
        setShowSettings(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener('keydown', onKeyDown);
    return () => {
      dialog.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [consent, showSettings]);

  useEffect(() => {
    const previousConsent = readCookieConsent();
    if (previousConsent?.analytics === true) loadGoogleTagManager();

    const syncConsent = (event: Event) => {
      const next = (event as CustomEvent<Consent>).detail;
      setConsent(next);
      setAllowAnalytics(next.analytics);
      if (next.analytics) {
        loadGoogleTagManager();
      } else if (previousAnalytics.current) {
        clearKnownAnalyticsCookies();
      }
      const wasEnabled = previousAnalytics.current;
      previousAnalytics.current = next.analytics;
      if (wasEnabled && !next.analytics) window.location.reload();
    };
    const openSettings = () => setShowSettings(true);
    window.addEventListener('zerocode:cookie-consent', syncConsent);
    window.addEventListener(MANAGE_EVENT, openSettings);
    return () => {
      window.removeEventListener('zerocode:cookie-consent', syncConsent);
      window.removeEventListener(MANAGE_EVENT, openSettings);
    };
  }, []);

  const choose = (analytics: boolean) => {
    const next = saveCookieConsent(analytics);
    setConsent(next);
    setAllowAnalytics(analytics);
    setShowSettings(false);
  };

  if (consent && !showSettings) return null;

  return (
    <aside
      ref={dialogRef}
      aria-label="Preferencias de privacidad"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-[200] mx-auto max-w-4xl border border-slate-300 bg-white p-5 text-slate-900 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <h2 id="cookie-consent-title" className="text-lg font-bold">
        Privacidad y medición de visitas
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-6">
        <p>Usamos almacenamiento local para recordar el idioma y tus preferencias. No es una cookie.</p>
        <p>Si aceptas la medición, Google Tag Manager cargará Metricool. Metricool recibe las páginas visitadas, la página de procedencia, el tamaño de pantalla y el país aproximado derivado de la dirección IP. Según su documentación, el código de seguimiento no instala cookies.</p>
        <p>La medición es opcional y no afecta al formulario ni al funcionamiento esencial de la web. Puedes cambiar tu elección desde la política de cookies.</p>
        <p>Consulta la <a className="underline" href="/politica-de-cookies">política de cookies</a> y la <a className="underline" href="/politica-de-privacidad">política de privacidad</a>.</p>
      </div>
      {showSettings && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <label className="flex items-start gap-3 text-sm leading-6">
            <input
              checked={allowAnalytics}
              className="mt-1"
              onChange={(event) => setAllowAnalytics(event.target.checked)}
              type="checkbox"
            />
            <span><strong>Medición opcional:</strong> permitir la carga de Metricool mediante Google Tag Manager.</span>
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-600">Las tecnologías necesarias para mostrar la web no se pueden desactivar desde este panel.</p>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {showSettings ? (
          <>
            <button className="border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-100" onClick={() => choose(false)} type="button">Rechazar opcionales</button>
            <button className="bg-sky-800 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-900" onClick={() => choose(allowAnalytics)} type="button">Guardar preferencias</button>
          </>
        ) : (
          <>
            <button className="border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-100" onClick={() => choose(false)} type="button">Rechazar</button>
            <button className="border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-100" onClick={() => setShowSettings(true)} type="button">Configurar</button>
            <button className="bg-sky-800 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-900" onClick={() => choose(true)} type="button">Aceptar medición</button>
          </>
        )}
      </div>
    </aside>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(MANAGE_EVENT));
}
