import { Plugin } from '@nuxt/types'
import { BroadcastChannel } from 'broadcast-channel'

const crossTabLogoutHandler: Plugin = ({}, inject) => {
  const logoutChannel = new BroadcastChannel('logout-channel')

  inject('logoutChannel', {
    postMessage: <T extends any>(message: T): void => {
      logoutChannel.postMessage(message)
    },
    addEventHandler: <T extends any>(messageHandler: (message: MessageEvent<T>) => void) => {
      logoutChannel.addEventListener('message', messageHandler)
    }
  })
}

export default crossTabLogoutHandler