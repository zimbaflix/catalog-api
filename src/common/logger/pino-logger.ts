import pino from 'pino';
import type { Logger } from './logger';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;
  private readonly meta: object;

  constructor(meta: object = {}) {
    this.meta = meta;
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
    });
  }

  debug(message: string, meta?: object): void {
    this.logger.debug({ message, ...this.meta, ...meta });
  }

  info(message: string, meta?: object): void {
    this.logger.info({ message, ...this.meta, ...meta });
  }

  warn(message: string, meta?: object): void {
    this.logger.warn({ message, ...this.meta, ...meta });
  }

  error(message: string, meta?: object): void {
    this.logger.error({ message, ...this.meta, ...meta });
  }

  child(meta: object): Logger {
    return new PinoLogger(meta);
  }
}
