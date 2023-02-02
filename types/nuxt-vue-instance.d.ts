import { Route, NavigationGuardNext } from 'vue-router'
import { ToastMessagePayload } from '~/helper/utilities/ToastHelper'

interface CustomService {
  $auth: {
    logout: () => Promise<void>,
    doLogin: (payload  : {email :string, password: string}) => Promise<void>
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

interface HtmlToPaperOptions {
  name: string;
  specs: string[];
  replace: boolean;
  styles: string[];
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

    $htmlToPaper: (el: Element | String, localOptions?: Partial<HtmlToPaperOptions>, cb?: () => boolean) => void;
  }
}

declare module '@nuxt/types' {
  interface Context extends CustomService {}
}