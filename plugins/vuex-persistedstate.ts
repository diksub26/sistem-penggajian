import { Plugin } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'

const vuexPersistedState: Plugin = async ({store, $config}): Promise<void> => {
  createPersistedState({
    key: 'CH48DODh2O1q6d0QGBVSRSTPdzvrsox78ygZ2opmkSz2NFLrkZ',
    paths: [
      'SystemState.authData',
      'SystemState.isLoggedIn',
    ]
  })(store)
}

export default vuexPersistedState