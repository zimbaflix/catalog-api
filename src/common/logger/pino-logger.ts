import pino from 'pino';
import type { Logger } from './logger';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  constructor(public meta: object = {}) {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        targets: process.env.NODE_ENV !== 'production' ? [{ target: 'pino-pretty', options: { colorize: true } }] : [],
      },
    }).child(meta);
  }

  debug(message: string, meta?: object): void {
    this.logger.debug({ message, ...meta });
  }

  info(message: string, meta?: object): void {
    this.logger.info({ message, ...meta });
  }

  warn(message: string, meta?: object): void {
    this.logger.warn({ message, ...meta });
  }

  error(message: string, meta?: object): void {
    if ('error' in meta) {
      const { error, ...rest } = meta;
      this.logger.error({ message, err: error, ...rest });
      return;
    }
    this.logger.error({ message, ...meta });
  }

  child(meta: object): Logger {
    return new PinoLogger(meta);
  }
}
