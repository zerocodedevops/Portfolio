// RUTA: ./src/utils/toast.js

import toast from 'react-hot-toast';
type PromiseMessages = Parameters<typeof toast.promise>[1];

// Custom toast configurations with consistent styling
export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 3000,
    style: {
      background: '#10b981',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 4000,
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  }),
  
  loading: (message: string) => toast.loading(message, {
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  }),
  
  info: (message: string) => toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  }),
  
  promise: <T>(promise: Promise<T>, messages: PromiseMessages) => toast.promise(promise, messages, {
    success: {
      style: {
        background: '#10b981',
        color: '#fff',
      },
    },
    error: {
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    },
    loading: {
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    },
  }),
};

export default showToast;
