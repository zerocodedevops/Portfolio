import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const SCRIPT_ID = 'zerocode-recaptcha-enterprise';
const SCRIPT_URL = 'https://www.google.com/recaptcha/enterprise.js?render=explicit&hl=es';

interface RecaptchaApi {
  ready?: (callback: () => void) => void;
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: 'light';
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
}

let apiLoadPromise: Promise<RecaptchaApi> | null = null;

function getRecaptchaApi(): RecaptchaApi | undefined {
  return window.grecaptcha?.enterprise ?? window.grecaptcha;
}

function loadRecaptchaApi(): Promise<RecaptchaApi> {
  const loadedApi = getRecaptchaApi();
  if (loadedApi) return Promise.resolve(loadedApi);
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise<RecaptchaApi>((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (script?.dataset.loadFailed === 'true') {
      script.remove();
      script = null;
    }

    const handleLoad = () => {
      const api = getRecaptchaApi();
      if (api) {
        resolve(api);
      } else {
        script?.remove();
        reject(new Error('reCAPTCHA Enterprise loaded without its API'));
      }
    };
    const handleError = () => {
      if (script) {
        script.dataset.loadFailed = 'true';
        script.remove();
      }
      reject(new Error('reCAPTCHA Enterprise script failed to load'));
    };

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
    }

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    if (!script.isConnected) document.head.append(script);
  }).catch((error: unknown) => {
    apiLoadPromise = null;
    throw error;
  });

  return apiLoadPromise;
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi & { enterprise?: RecaptchaApi };
  }
}

export interface RecaptchaV2Handle {
  reset: () => void;
}

interface RecaptchaV2Props {
  siteKey: string;
  onTokenChange: (token: string) => void;
  onError: () => void;
}

export const RecaptchaV2 = forwardRef<RecaptchaV2Handle, RecaptchaV2Props>(
  function RecaptchaV2({ siteKey, onTokenChange, onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [retryKey, setRetryKey] = useState(0);

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetIdRef.current !== null) getRecaptchaApi()?.reset(widgetIdRef.current);
        onTokenChange('');
      },
    }), [onTokenChange]);

    useEffect(() => {
      let cancelled = false;
      const renderWidget = (api: RecaptchaApi) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
        const mount = () => {
          if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
          try {
            widgetIdRef.current = api.render(containerRef.current, {
              sitekey: siteKey,
              theme: 'light',
              callback: (token) => onTokenChange(token),
              'expired-callback': () => onTokenChange(''),
              'error-callback': () => {
                setStatus('error');
                onTokenChange('');
                onError();
              },
            });
            setStatus('ready');
          } catch {
            setStatus('error');
            onError();
          }
        };

        try {
          // The Enterprise script can download before its internals are ready.
          // Google requires render() to run from its ready callback.
          if (api.ready) api.ready(mount);
          else mount();
        } catch {
          setStatus('error');
          onError();
        }
      };

      loadRecaptchaApi()
        .then(renderWidget)
        .catch(() => {
          if (!cancelled) {
            setStatus('error');
            onError();
          }
        });

      return () => {
        cancelled = true;
      };
    }, [onError, onTokenChange, retryKey, siteKey]);

    const retry = () => {
      if (widgetIdRef.current !== null) {
        getRecaptchaApi()?.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      containerRef.current?.replaceChildren();
      setStatus('loading');
      setRetryKey((current) => current + 1);
    };

    return (
      <div className="space-y-2" aria-live="polite">
        <div ref={containerRef} />
        {status === 'loading' && <p className="text-sm text-slate-600">Cargando protección antispam…</p>}
        {status === 'error' && (
          <div className="space-y-2">
            <p className="text-sm text-red-700" role="alert">No se pudo cargar reCAPTCHA. Comprueba tu conexión y vuelve a intentarlo.</p>
            <button type="button" onClick={retry} className="text-sm font-semibold text-primary-700 underline underline-offset-2">
              Reintentar
            </button>
          </div>
        )}
      </div>
    );
  },
);

RecaptchaV2.displayName = 'RecaptchaV2';
