import * as MessageType from './MessageType'

type MessagePayload<T extends any> = {
  type: MessageType.Type;
  data?: T;
}

export { MessagePayload, MessageType }