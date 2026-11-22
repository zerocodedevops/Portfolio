/**
 * Sistema de logging centralizado.
 * Solo muestra logs en desarrollo, excepto errores que siempre se muestran.
 */

const isDev = import.meta.env.DEV;

type LogArguments = unknown[];

export const logger = {
  log: (...args: LogArguments): void => {
    if (isDev) console.log(...args);
  },
  info: (...args: LogArguments): void => {
    if (isDev) console.info(...args);
  },
  warn: (...args: LogArguments): void => {
    if (isDev) console.warn(...args);
  },
  error: (...args: LogArguments): void => {
    console.error(...args);
  },
  debug: (...args: LogArguments): void => {
    if (isDev) console.debug(...args);
  },
};

export default logger;
