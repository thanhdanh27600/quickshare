const { QueueServiceClient } = require('@azure/storage-queue');
const { postProcessForward } = require('./postProcessForward');

const connStr = process.env.AZURE_QUEUE_CONNECTION_STRING;
const queueName = 'quickshare';

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
      const response = await queueClient.receiveMessages();
      if (response.receivedMessageItems.length === 1) {
        const receivedMessageItem = response.receivedMessageItems[0];
        await processMessage(receivedMessageItem);
        const deleteMessageResponse = await queueClient.deleteMessage(
          receivedMessageItem.messageId,
          receivedMessageItem.popReceipt,
        );
        console.log(`Delete message successfully, service assigned request Id: ${deleteMessageResponse.requestId}`);
      }
    }
  } catch (error) {
    console.error('Error while queueProcessor', error);
  }
}

module.exports = { sendMessageToQueue, queueProcessor };
