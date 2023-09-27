// const { QueueServiceClient } = require('@azure/storage-queue');

// const connStr =
//   process.env.AZURE_QUEUE_CONNECTION_STRING ||
//   'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net';
// const queueName = process.env.AZURE_STORAGE_QUEUE_NAME || 'myqueue';
// const queueServiceClient = QueueServiceClient.fromConnectionString(connStr);

// /**
//  *
//  * @param {string} message
//  */
// async function sendMessageToQueue(message) {
//   try {
//     if (!message) return;
//     const queueClient = queueServiceClient.getQueueClient(queueName);
//     // Send a message into the queue using the sendMessage method.
//     const sendMessageResponse = await queueClient.sendMessage(message);
//     console.log(
//       `Sent message successfully, service assigned message Id: ${sendMessageResponse.messageId}, service assigned request Id: ${sendMessageResponse.requestId}`,
//     );
//   } catch (error) {
//     console.error('Error while sendMessageToQueue', error);
//   }
// }

// async function queueProcessor() {
//   try {
//     console.log('Starting queue processor');
//     const queueClient = queueServiceClient.getQueueClient(queueName);
//     while (true) {
//       const response = await queueClient.receiveMessages({ numberOfMessages: 2 });
//       for (let i = 0; i < response.receivedMessageItems.length; i++) {
//         const receivedMessageItem = response.receivedMessageItems[i];
//         await processMessage(receivedMessageItem);
//         const deleteMessageResponse = await queueClient.deleteMessage(
//           receivedMessageItem.messageId,
//           receivedMessageItem.popReceipt,
//         );
//         console.log(`Delete message successfully, service assigned request Id: ${deleteMessageResponse.requestId}`);
//       }
//       // Wait for a while before checking for new messages
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//     }
//   } catch (error) {
//     console.error('Error while queueProcessor', error);
//   }
// }

// module.exports = { sendMessageToQueue, queueProcessor };

const { postProcessForward } = require('./postProcessForward');
const { ServiceBusClient } = require('@azure/service-bus');
const { connectionString, queueName, logger } = require('./utils');

/**
 * An array of objects representing message types.
 * @typedef {Object} MessageType
 * @property {string} subject - The subject of the message.
 * @property {*} body - The body of the message, which can be of any type.
 */

/**
 * Process a single message.
 *
 * @param {MessageType} message - The message to be processed.
 * @returns {Promise<void>} A Promise that resolves when the processing is complete.
 *
 * @throws {Error} Throws an error if the message processing fails.
 */
async function myMessageHandler(message) {
  try {
    // console.log(`Processing message ${message.subject} with content: ${JSON.stringify(message.body)}`);
    switch (message.subject) {
      case 'forward':
        await postProcessForward(message.body);
        break;
      default:
        break;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

let sbClient;
let receiver;

async function main() {
  console.log('Starting Queue Receiver');
  // create a Service Bus client using the connection string to the Service Bus namespace
  sbClient = new ServiceBusClient(connectionString);

  // createReceiver() can also be used to create a receiver for a subscription.
  receiver = sbClient.createReceiver(queueName);

  // function to handle any errors
  const myErrorHandler = async (error) => {
    console.log(error);
  };

  // subscribe and specify the message and error handlers
  receiver.subscribe({
    processMessage: myMessageHandler,
    processError: myErrorHandler,
  });
}

const queueReceiver = () => {
  main().catch((err) => {
    console.log('Error Queue Receiver: ', err);
  });
  // .finally(async () => {
  //   await receiver.close();
  //   await sbClient.close();
  // });
};

module.exports = { queueReceiver };
