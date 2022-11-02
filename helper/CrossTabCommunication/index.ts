import { BroadcastChannel, BroadcastChannelOptions } from 'broadcast-channel'

function createChannel<T = any>(channelName: string, options?: BroadcastChannelOptions) {
  return new BroadcastChannel<T>(channelName, options)
}

export { createChannel }
