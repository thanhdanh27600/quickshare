import { AMQPClient } from '@cloudamqp/amqp-client';
import { NextApiRequest, NextApiResponse } from 'next';
import { RabbitMQChannel } from 'types/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const amqp = new AMQPClient(process.env.RABBITMQ_URL || '');
  const conn = await amqp.connect();
  const channel = await conn.channel();
  const queue = await channel.queue(RabbitMQChannel.SHORTENED);
  await queue.publish('Hello World' + new Date().getTime(), { deliveryMode: 2 });
  await conn.close();
  res.send('OK');
}
