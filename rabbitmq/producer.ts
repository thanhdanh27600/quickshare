import { AMQPClient } from '@cloudamqp/amqp-client';
import { MessagePayload } from 'rabbitmq';
import { RabbitMQChannel } from 'types/constants';

export const publish = async (payload: MessagePayload) => {
  const amqp = new AMQPClient(process.env.RABBITMQ_URL || '');
  const conn = await amqp.connect();
  const channel = await conn.channel();
  const queue = await channel.queue(RabbitMQChannel.SHORTENED);
  await queue.publish(JSON.stringify(payload), { deliveryMode: 2 });
  await conn.close();
};
