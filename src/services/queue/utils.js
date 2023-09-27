const pino = require('pino');
// connection string to your Service Bus namespace
const connectionString =
  process.env.AZURE_BUS_CONNECTION_STRING ||
  'Endpoint=sb://example.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=example';

// name of the queue
const queueName = process.env.AZURE_BUS_QUEUE_NAME || '';

const isTest = process.env.NODE_ENV === 'test';

const logger = pino(
  {
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.transport({
    target: 'pino/file',
    options: { destination: `pino.log` },
  }),
);

module.exports = {
  connectionString,
  queueName,
  isTest,
  logger,
};
