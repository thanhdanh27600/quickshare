import { publish } from './producer';

export const RabbitMQService = {
  publish: publish,
};

export type MessagePayload = {
  type: MessageType;
  data: any;
};

export enum MessageType {
  FORWARD = 'FORWARD',
}
