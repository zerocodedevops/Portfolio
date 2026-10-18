import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const root = siteRef.current;
    const form = root.querySelector<HTMLFormElement>('#quoteForm');
    const notice = document.createElement('aside');
    notice.id = 'zero-delay-demo-notice';
    notice.className = 'mx-auto max-w-[1280px] border-b border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-slate-800';
    notice.setAttribute('aria-label', 'Aviso de demostración');
    notice.textContent = 'ZeroDelay es una demostración: todos los datos son simulados, incluidos precios, cifras, servicios, seguros, garantías, horarios y disponibilidad. El planificador no envía ni almacena los datos introducidos.';
    root.querySelector('main')?.prepend(notice);
    form?.setAttribute('aria-describedby', notice.id);

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      if (!form || !form.reportValidity()) return;

      // Demo-only: do not open WhatsApp, log, persist, or transmit the entered values.
      form.reset();
      form.querySelector('[data-demo-status]')?.remove();
      const status = document.createElement('p');
      status.dataset.demoStatus = 'true';
      status.className = 'mt-3 rounded-lg border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-slate-800';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.textContent = 'Consulta simulada. No se ha enviado ni almacenado ningún dato.';
      form.append(status);
    };

    const closeMobileMenu = (event: Event) => {
      const target = event.target;
      if (target instanceof Element) target.closest('details')?.removeAttribute('open');
    };

    form?.addEventListener('submit', handleSubmit);
    root.addEventListener('click', closeMobileMenu);
    return () => {
      form?.removeEventListener('submit', handleSubmit);
      root.removeEventListener('click', closeMobileMenu);
      notice.remove();
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
    </>
  );
}
