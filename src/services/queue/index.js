const { QueueServiceClient } = require('@azure/storage-queue');
const { postProcessForward } = require('./postProcessForward');

const connStr =
  process.env.AZURE_QUEUE_CONNECTION_STRING ||
  'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net';
const queueName = process.env.AZURE_STORAGE_QUEUE_NAME || 'myqueue';
const queueServiceClient = QueueServiceClient.fromConnectionString(connStr);

/**
 *
 * @param {string} message
 */
async function sendMessageToQueue(message) {
  try {
    if (!message) return;
    const queueClient = queueServiceClient.getQueueClient(queueName);
    // Send a message into the queue using the sendMessage method.
    const sendMessageResponse = await queueClient.sendMessage(message);
    console.log(
      `Sent message successfully, service assigned message Id: ${sendMessageResponse.messageId}, service assigned request Id: ${sendMessageResponse.requestId}`,
    );
  } catch (error) {
    console.error('Error while sendMessageToQueue', error);
  }
}

async function processMessage(message) {
  try {
    console.log(`Processing message with content: ${message.messageText}`);
    const messageObj = JSON.parse(message.messageText);
    switch (messageObj.type) {
      case 'forward':
        await postProcessForward(messageObj.payload);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Error while processMessage', error);
  }
}

async function queueProcessor() {
  try {
    console.log('Starting queue processor');
    const queueClient = queueServiceClient.getQueueClient(queueName);
    while (true) {
      const response = await queueClient.receiveMessages({ numberOfMessages: 2 });
      for (let i = 0; i < response.receivedMessageItems.length; i++) {
        const receivedMessageItem = response.receivedMessageItems[i];
        await processMessage(receivedMessageItem);
        const deleteMessageResponse = await queueClient.deleteMessage(
          receivedMessageItem.messageId,
          receivedMessageItem.popReceipt,
        );
        console.log(`Delete message successfully, service assigned request Id: ${deleteMessageResponse.requestId}`);
      }
      // Wait for a while before checking for new messages
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error('Error while queueProcessor', error);
  }
}

module.exports = { sendMessageToQueue, queueProcessor };
