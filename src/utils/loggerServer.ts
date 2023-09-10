import pino from 'pino';
import { isProduction, isTest } from '../types/constants';

module.exports = isTest
  ? {
      info(message: any) {
        //  console.log('[INFO]: ', message);
      },
      warn(message: any) {
        console.warn('[WARN]: ', message);
      },
      error(message: any) {
        console.error('[ERROR]: ', message);
      },
    }
  : pino(
      {
        formatters: {
          level: (label: string) => {
            return { level: label.toUpperCase() };
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.transport({
        target: 'pino/file',
        options: { destination: isProduction ? `pino.log` : `./logs/pino.log` },
      }),
    );
