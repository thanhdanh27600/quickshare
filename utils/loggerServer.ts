import pino from 'pino';

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./logs/pino.log` },
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
