import { useEffect, useMemo, type FormEvent as ReactFormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Seo } from '@/components/common/SEO';
import './zero-breakdown-reference.css';
import principal from './reference-pages/principal.html?raw';
import fontaneria from './reference-pages/fontaneria.html?raw';
import electricidad from './reference-pages/electricidad.html?raw';
import climatizacion from './reference-pages/climatizacion.html?raw';

type ReferencePage = {
  company: string;
  title: string;
  description: string;
  script: string;
  html: string;
};

const pages: Record<string, ReferencePage> = {
  'zero-breakdown': {
    company: 'ZeroBreakDown',
    title: 'ZeroBreakDown | Electricidad, fontanería y climatización',
    description: 'Electricidad, fontanería y climatización para viviendas y negocios.',
    script: 'principal',
    html: principal,
  },
  fontaneria: {
    company: 'ZeroLeaks',
    title: 'ZeroLeaks | Fontanería',
    description: 'Fontanería, instalaciones y averías de agua.',
    script: 'fontaneria',
    html: fontaneria,
  },
  electricidad: {
    company: 'ZeroBlackout',
    title: 'ZeroBlackout | Electricidad',
    description: 'Instalaciones y servicios eléctricos.',
    script: 'electricidad',
    html: electricidad,
  },
  climatizacion: {
    company: 'ZeroHeat',
    title: 'ZeroHeat | Climatización',
    description: 'Climatización, calefacción y aerotermia.',
    script: 'climatizacion',
    html: climatizacion,
  },
};

const fontStylesheets = [
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
  'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap',
];

function getPageContent(source: string) {
  const body = source.match(/<body\b([^>]*)>([\s\S]*?)<\/body>/i);
  const bodyClass = body?.[1].match(/class="([^"]+)"/i)?.[1] ?? '';
  const styles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join('\n');
  const html = (body?.[2] ?? source)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\s+on(?:click|submit|change|input)=("[^"]*"|'[^']*')/gi, '');

  return { bodyClass, html, styles };
}

function associateFormLabels(root: HTMLElement) {
  root.querySelectorAll('form').forEach((form, formIndex) => {
    form.setAttribute('autocomplete', 'off');
    form.querySelectorAll('label').forEach((label, labelIndex) => {
      if (label.htmlFor || label.querySelector('input, select, textarea')) return;
      const parent = label.parentElement;
      const nextSibling = label.nextElementSibling;
      const control = nextSibling instanceof HTMLElement && nextSibling.matches('input, select, textarea')
        ? nextSibling
        : parent?.querySelector('input, select, textarea');
      if (!control) return;
      if (!control.id) control.id = `zb-form-${formIndex}-field-${labelIndex}`;
      label.htmlFor = control.id;
    });

    if (!form.querySelector('[data-demo-privacy]')) {
      const note = document.createElement('p');
      note.dataset.demoPrivacy = 'true';
      note.id = `zb-form-${formIndex}-demo-note`;
      note.className = 'my-3 rounded border border-secondary/30 bg-surface-container px-4 py-3 text-sm text-on-surface';
      note.textContent = 'Formulario de demostración: el envío es simulado. No introduzcas datos reales; la información no se envía ni se almacena.';
      form.prepend(note);
      form.setAttribute('aria-describedby', note.id);
    }
  });
}

export default function ZeroBreakdownDemo() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1] || 'zero-breakdown';
  const page = pages[slug] ?? pages['zero-breakdown'];
  const content = useMemo(() => getPageContent(page.html), [page]);

  function handleReferenceClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (slug !== 'fontaneria' || !(event.target instanceof Element)) return;

    const button = event.target.closest<HTMLButtonElement>('[data-zb-action]');
    if (!button) return;

    const action = button.dataset.zbAction ?? '';
    if (action.startsWith('adjustPressure')) {
      const display = document.getElementById('live-gauge-val');
      const bar = document.getElementById('pressure-fill');
      const current = Number.parseFloat(display?.textContent ?? '4.2');
      const delta = Number(action.match(/-?[0-9.]+/)?.[0] ?? 0);
      const next = Math.max(1, Math.min(6.5, current + delta));
      if (display) display.textContent = `${next.toFixed(2)} BAR`;
      if (bar) {
        bar.style.width = `${(next / 6.5) * 100}%`;
        bar.className = next > 5
          ? 'h-full bg-secondary-container transition-all duration-700'
          : 'h-full bg-secondary transition-all duration-700';
      }
      return;
    }

    if (action.startsWith('toggleFaq')) {
      const id = action.match(/faq-[0-9]+/)?.[0];
      const panel = id ? document.getElementById(id) : null;
      const icon = id ? document.getElementById(`icon-${id}`) : null;
      if (panel) {
        const open = panel.classList.toggle('hidden') === false;
        if (icon) icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
      }
      return;
    }

    const modal = document.getElementById('modal-diagnostico');
    if (action === 'openModal') modal?.classList.remove('hidden');
    if (action === 'closeModal') modal?.classList.add('hidden');
  }

  function handleReferenceSubmit(event: ReactFormEvent<HTMLDivElement>) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    const feedback = document.createElement('p');
    feedback.className = 'my-3 rounded border border-secondary/30 bg-surface-container px-4 py-3 text-sm text-on-surface';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.textContent = 'Envío simulado. No se ha enviado ni almacenado ningún dato.';
    form.querySelector('[data-demo-submit-feedback]')?.remove();
    feedback.dataset.demoSubmitFeedback = 'true';
    form.append(feedback);
    form.reset();
  }

  useEffect(() => {
    const lifecycle = new AbortController();
    let hashScrollFrame = 0;
    const browserWindow = window as Window & { __zeroBreakdownLifecycle?: AbortController };
    browserWindow.__zeroBreakdownLifecycle = lifecycle;
    const links = fontStylesheets.map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.zeroBreakdownFont = 'true';
      document.head.append(link);
      return link;
    });
    const script = slug === 'fontaneria' ? null : document.createElement('script');
    if (script) {
      script.src = `/zero-breakdown/${page.script}.js`;
      script.async = false;
      script.dataset.zeroBreakdownPage = page.script;
      document.body.append(script);
    }
    const contentRoot = document.querySelector('.zero-breakdown-reference');
    if (contentRoot instanceof HTMLElement) {
      associateFormLabels(contentRoot);
      const main = contentRoot.querySelector('main');
      if (main && !main.querySelector('[data-demo-banner]')) {
        const banner = document.createElement('aside');
        banner.dataset.demoBanner = 'true';
        banner.className = 'mx-auto max-w-7xl border-b border-secondary/30 bg-surface-container-high px-6 py-3 text-sm text-on-surface lg:px-12';
        banner.setAttribute('aria-label', 'Aviso de demostración');
        banner.textContent = 'ZeroBreakDown es una demostración: todos los datos son simulados, incluidos precios, cifras, servicios, garantías, certificaciones y disponibilidad. Los formularios no envían ni almacenan información.';
        main.prepend(banner);
      }
      const contactForm = contentRoot.querySelector('form');
      const contactSection = contentRoot.querySelector('#guardia-urgente')
        ?? contactForm?.closest('section')
        ?? contactForm;
      if (contactSection instanceof HTMLElement && !contentRoot.querySelector('#contacto')) {
        const anchor = document.createElement('span');
        anchor.id = 'contacto';
        anchor.className = 'block scroll-mt-24';
        anchor.setAttribute('aria-hidden', 'true');
        contactSection.prepend(anchor);
      }
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      if (hashId) {
        hashScrollFrame = window.requestAnimationFrame(() => {
          contentRoot.querySelector<HTMLElement>(`#${CSS.escape(hashId)}`)?.scrollIntoView({ block: 'start' });
        });
      }
    }

    return () => {
      lifecycle.abort();
      if (browserWindow.__zeroBreakdownLifecycle === lifecycle) {
        delete browserWindow.__zeroBreakdownLifecycle;
      }
      script?.remove();
      links.forEach((link) => link.remove());
      if (hashScrollFrame) window.cancelAnimationFrame(hashScrollFrame);
    };
  }, [page.script]);

  return (
    <>
      <Seo title={page.title} description={page.description} url={`https://zerocode-devops.com${pathname}`} />
      <style>{content.styles}</style>
      <div
        className={`zero-breakdown-reference ${content.bodyClass}`}
        onClick={handleReferenceClick}
        onSubmit={handleReferenceSubmit}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </>
  );
}
