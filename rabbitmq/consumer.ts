// @ts-nocheck
export = {};
// const { AMQPClient } = require('@cloudamqp/amqp-client');

// async function initRabbitMQ() {
//   try {
//     const amqp = new AMQPClient(process.env.RABBITMQ_URL);
//     const conn = await amqp.connect();
//     const channel = await conn.channel();
//     const queue = await channel.queue('shortened'); // RabbitMQChannel.SHORTENED
//     await queue.subscribe({ noAck: true }, consumer);
//     console.log('RabittMQ is running');
//   } catch (error) {
//     console.error('RabittMQ', error);
//     error.connection.close();
//   }
// }

// const consumer = async (msg) => {
//   // console.log('RabittMQ received: ', msg.bodyToString());
//   console.log(JSON.parse(msg.bodyToString()));
//   await setTimeout(() => {
//     console.log('processed', msg.bodyToString());
//   }, 5000);
//   // await consumer.cancel();
// };
// module.exports = { initRabbitMQ };
