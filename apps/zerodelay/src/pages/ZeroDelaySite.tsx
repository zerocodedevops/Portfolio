import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/Logo0.webp';
import heroImage from '../assets/zero-delay-html/hero.webp';
import hogarImage from '../assets/zero-delay-html/hogar.webp';
import oficinaImage from '../assets/zero-delay-html/oficina.webp';
import guardamueblesImage from '../assets/zero-delay-html/guardamuebles.webp';
import grupajesImage from '../assets/zero-delay-html/grupajes.webp';
import { zeroDelayMarkup } from './ZeroDelayMarkup';

const images: Record<string, string> = {
  __ZERO_DELAY_LOGO__: logo,
  __ZERO_DELAY_HERO__: heroImage,
  __ZERO_DELAY_HOGAR__: hogarImage,
  __ZERO_DELAY_OFICINA__: oficinaImage,
  __ZERO_DELAY_GUARDAMUEBLES__: guardamueblesImage,
  __ZERO_DELAY_GRUPAJES__: grupajesImage,
};

const markup = Object.entries(images).reduce(
  (html, [token, url]) => html.split(token).join(url),
  zeroDelayMarkup,
);

export default function ZeroDelaySite() {
  const siteRef = useRef<HTMLDivElement>(null);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => {
    const root = siteRef.current;
    const form = root?.querySelector<HTMLFormElement>('#quoteForm');
    if (!root || !form) return;
    form.setAttribute('aria-describedby', 'zero-delay-demo-notice');

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      // Demo-only: do not open WhatsApp, log, persist, or transmit the entered values.
      form.reset();
      setSimulated(true);
    };

    const closeMobileMenu = (event: Event) => {
      const target = event.target;
      if (target instanceof Element) target.closest('details')?.removeAttribute('open');
    };

    form.addEventListener('submit', handleSubmit);
    root.addEventListener('click', closeMobileMenu);
    return () => {
      form.removeEventListener('submit', handleSubmit);
      root.removeEventListener('click', closeMobileMenu);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Zero Delay | Logística y mudanzas</title>
        <meta
          name="description"
          content="Mudanzas de hogar y oficina, guardamuebles y grupajes. Cuéntanos tu ruta para preparar una consulta."
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
      </Helmet>
      <div
        ref={siteRef}
        id="zero-delay-site"
        className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <aside id="zero-delay-demo-notice" className="fixed bottom-3 left-3 z-[100] max-w-sm rounded-lg border border-amber-500/50 bg-amber-50 px-4 py-3 text-xs text-slate-800 shadow-xl" aria-label="Aviso de demostración">
        Demo interactiva: cifras, seguros, garantías, horarios y datos de contacto son ejemplos simulados. El planificador no envía ni almacena los datos introducidos.
      </aside>
      {simulated && (
        <p role="status" aria-live="polite" className="fixed bottom-24 left-3 z-[100] max-w-sm rounded-lg border border-amber-500/50 bg-amber-50 px-4 py-3 text-sm text-slate-800 shadow-xl">
          Consulta simulada. No se ha enviado ni almacenado ningún dato.
        </p>
      )}
    </>
  );
}
