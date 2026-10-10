// @vitest-environment jsdom
import { createRef } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RecaptchaV2, type RecaptchaV2Handle } from '@/components/RecaptchaV2';

describe('reCAPTCHA v2 widget', () => {
  afterEach(() => {
    cleanup();
    delete window.grecaptcha;
  });

  it('passes the solved token to the form and can reset the widget', async () => {
    let callbacks: Parameters<NonNullable<typeof window.grecaptcha>['render']>[1] | undefined;
    const reset = vi.fn();
    window.grecaptcha = {
      render: vi.fn((_container, options) => {
        callbacks = options;
        return 7;
      }),
      reset,
    };
    const onTokenChange = vi.fn();
    const ref = createRef<RecaptchaV2Handle>();

    render(
      <RecaptchaV2
        ref={ref}
        siteKey="public-site-key"
        onTokenChange={onTokenChange}
        onError={vi.fn()}
      />,
    );

    await vi.waitFor(() => {
      expect(screen.queryByText(/Cargando protección antispam/)).toBeNull();
    });
    expect(window.grecaptcha.render).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ sitekey: 'public-site-key' }));
    act(() => callbacks?.callback('verified-token'));
    expect(onTokenChange).toHaveBeenCalledWith('verified-token');

    act(() => ref.current?.reset());
    expect(reset).toHaveBeenCalledWith(7);
    expect(onTokenChange).toHaveBeenLastCalledWith('');
  });
});
