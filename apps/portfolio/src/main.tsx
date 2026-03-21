import React from 'react';
import ReactDOM from 'react-dom/client';
import 'sileo/styles.css';
import './styles/index.css';
import { Providers } from './app/providers';
import { Router } from './app/router';
import { ErrorBoundary } from './components/ErrorBoundary';
// import { Toaster } from 'sileo';
// import { initGA, logPageView } from './lib/analytics';
import './i18n/config';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Providers>
        <Router />
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>,
);
