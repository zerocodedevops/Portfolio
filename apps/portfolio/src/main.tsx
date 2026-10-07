import React from 'react';
import ReactDOM from 'react-dom/client';
import 'sileo/styles.css';
import './styles/index.css';
import { Providers } from './app/providers';
import { Router } from './app/router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CookieConsent } from './components/CookieConsent';
// import { Toaster } from 'sileo';
import './i18n/config';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Providers>
        <Router />
        <CookieConsent />
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>,
);
