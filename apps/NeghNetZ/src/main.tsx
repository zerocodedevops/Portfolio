import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './App.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { resetDemoStore } from './demo/demoStore';
import { signOut } from './demo/demoAuth';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento raíz de la aplicación.');
}

async function startApplication() {
  resetDemoStore();
  await signOut();

  createRoot(rootElement!).render(
    <StrictMode>
      <ThemeProvider>
        <App />
        <Toaster position="top-right" />
      </ThemeProvider>
    </StrictMode>,
  );
}

void startApplication();
