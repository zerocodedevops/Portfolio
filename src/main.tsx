import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { Providers } from './app/providers';
import { Router } from './app/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <Router />
    </Providers>
  </React.StrictMode>
);
