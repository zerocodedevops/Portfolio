import { useEffect } from 'react';

/**
 * Hook para animar elementos al hacer scroll de forma ligera.
 * Solo activo en pantallas >= 768px. En móviles se inicializan mostrados.
 * 
 * Uso: añadir clase `scroll-reveal` al elemento.
 * El CSS (en base.css) se encargará de `transform: translateY(20px)` a `0` y `opacity: 0` a `1`.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof globalThis === 'undefined' || !globalThis.matchMedia) return;

    const revealElements = document.querySelectorAll('.scroll-reveal');
    const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      revealElements.forEach(el => el.classList.add('reveal-active'));
      return;
    }

    document.documentElement.classList.add('scroll-reveal-enabled');

    const isDesktop = globalThis.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) {
      // En móviles, forzar que todo sea visible inmediatamente
      revealElements.forEach(el => el.classList.add('reveal-active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Seleccionar solo elementos que NO han sido activados aún
    const elements = document.querySelectorAll('.scroll-reveal:not(.reveal-active)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);
}
