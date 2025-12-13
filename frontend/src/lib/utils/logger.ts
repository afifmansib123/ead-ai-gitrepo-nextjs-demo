// Simple logger for Next.js (Vercel compatible)
// Vercel handles logging automatically, so we keep it simple

type LogLevel = 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: any;
}

const log = (level: LogLevel, message: string, meta?: LogMeta) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';

  if (level === 'error') {
    console.error(`[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`);
  } else {
    console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`);
  }
};

const logger = {
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
};

export default logger;
