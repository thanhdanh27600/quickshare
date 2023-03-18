import pino from 'pino';
import { isProduction } from 'types/constants';

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: isProduction ? `pino.log` : `./logs/pino.log` },
});

module.exports = pino(
  {
    formatters: {
      level: (label: string) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  fileTransport,
);
