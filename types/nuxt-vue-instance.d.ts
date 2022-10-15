import { Route, NavigationGuardNext } from 'vue-router'
import { ToastMessagePayload } from '~/helper/utilities/ToastHelper'

interface CustomService {
  $auth: {
    logout: () => Promise<void>
  }

  $notifier: {
    showMessage: (payload: ToastMessagePayload) => void
  }

  $logoutChannel: {
    postMessage: <T extends any>(message: T) => void;
    addEventHandler: <T extends any>(messageHandler: (message: MessageEvent<T>) => void) => void;
  },

  $gmapApiPromiseLazy : () => Promise<void>
}

declare module 'vue/types/vue' {
  interface Vue extends CustomService {
    beforeRouteEnter?(
      to: Route,
      from: Route,
      next: NavigationGuardNext<Vue>
    ): void

    beforeRouteLeave?(
      to: Route,
      from: Route,
      next: NavigationGuardNext<Vue>
    ): void

    beforeRouteUpdate?(
      to: Route,
      from: Route,
      next: NavigationGuardNext<Vue>
    ): void
  }
}

declare module '@nuxt/types' {
  interface Context extends CustomService {}
}