import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (globalThis.window !== undefined) {
      return globalThis.window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (globalThis.window !== undefined) {
      const media = globalThis.window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [matches, query]);

  return matches;
}
