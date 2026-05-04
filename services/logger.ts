export const logger = {
  log: (...args: unknown[]) => {
    console.log(...args);
  },
  info: (...args: unknown[]) => {
    console.info(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  error: (message: string, error?: unknown) => {
    const isDev = import.meta.env?.DEV ?? false;

    if (isDev) {
      console.error(message, error);
    } else {
      // In production, we don't log the raw error object to avoid leaking stack traces
      // or internal paths to the browser console.
      let safeErrorDetails = "An unexpected error occurred.";

      if (error instanceof Error) {
          // Only log the message, not the stack trace
          safeErrorDetails = error.message;
      } else if (typeof error === 'string') {
          safeErrorDetails = error;
      }

      console.error(`[Security Safe Log] ${message}: ${safeErrorDetails}`);
    }
  }
};
