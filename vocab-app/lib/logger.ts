/**
 * Simple logger utility for both client and server environments
 * Helps with debugging by providing better context in logs
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isServer = typeof window === 'undefined';

class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]:`;
    
    switch (level) {
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          console.debug(prefix, message, ...args);
        }
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }

    // Log to server logs more explicitly if in server environment
    if (isServer && level === 'error') {
      // This helps ensure errors are visible in server logs
      console.trace(`${prefix} ${message}`, ...args);
    }
  }
}

// Factory function to create loggers with context
export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Default logger
export default createLogger('App');
