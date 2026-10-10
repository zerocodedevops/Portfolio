// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CookieConsent } from '@/components/CookieConsent';
import { COOKIE_CONSENT_KEY } from '@/lib/cookieConsent';

describe('cookie preferences', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('stores only necessary preferences and does not enable analytics', () => {
    render(<CookieConsent />);

    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Entendido' }));

    expect(JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) ?? 'null')).toMatchObject({
      necessary: true,
      analytics: false,
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps optional analytics disabled in the settings panel', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Configurar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar selección' }));

    expect(JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) ?? 'null').analytics).toBe(false);
  });
});
