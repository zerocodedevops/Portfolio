import { useState, useEffect } from 'react';

/**
 * Detecta la primera interacción del usuario en la pantalla (scroll, touch, ratón).
 * Ideal para diferir la carga (lazy load) de componentes que no están en el primer viewport
 * sin bloquear el thread principal (LCP/FCP).
 */
export function useUserInteraction(): boolean {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Si ya interactuó, no necesitamos poner escuchadores
    if (hasInteracted) return;

    if (globalThis.window === undefined) return;

    const handleInteraction = () => {
      setHasInteracted(true);
      
      // Cleanup para no sobrecargar
      globalThis.window.removeEventListener('scroll', handleInteraction);
      globalThis.window.removeEventListener('mousemove', handleInteraction);
      globalThis.window.removeEventListener('touchstart', handleInteraction);
      globalThis.window.removeEventListener('keydown', handleInteraction);
    };

    globalThis.window.addEventListener('scroll', handleInteraction, { passive: true, once: true });
    globalThis.window.addEventListener('mousemove', handleInteraction, { passive: true, once: true });
    globalThis.window.addEventListener('touchstart', handleInteraction, { passive: true, once: true });
    globalThis.window.addEventListener('keydown', handleInteraction, { passive: true, once: true });

    return () => {
      globalThis.window.removeEventListener('scroll', handleInteraction);
      globalThis.window.removeEventListener('mousemove', handleInteraction);
      globalThis.window.removeEventListener('touchstart', handleInteraction);
      globalThis.window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  return hasInteracted;
}
