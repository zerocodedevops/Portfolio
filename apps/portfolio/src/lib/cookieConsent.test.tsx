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

  it('allows visitors to reject optional measurement', () => {
    render(<CookieConsent />);

    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));

    expect(JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) ?? 'null')).toMatchObject({
      necessary: true,
      analytics: false,
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('allows visitors to save their optional measurement preference', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Configurar' }));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar preferencias' }));

    expect(JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) ?? 'null').analytics).toBe(true);
  });
});
