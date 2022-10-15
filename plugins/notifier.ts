import { Plugin } from '@nuxt/types'
import { ToastMessagePayload } from '~/helper/utilities/ToastHelper'

const notifier: Plugin = ({ store }, inject): void => {
  inject('notifier', {
    showMessage: (payload: ToastMessagePayload): void => {
      store.commit('SystemState/PUSH_MESSAGE', {...payload})
    }
  })
}

export default notifier
