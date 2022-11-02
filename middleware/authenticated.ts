import { Middleware } from '@nuxt/types'
import axios from 'axios'
import * as SystemStateHelper from '~/helper/store/SystemState'
import AuthAPI from '~/services/AuthAPI'
const authenticated: Middleware = async(context): Promise<void> => {
    try {
        const token = context.store.getters[SystemStateHelper.default.getter.getAuthToken]
        const isLoggedIn = context.store.getters[SystemStateHelper.default.getter.getIsLoggedIn]
        context.store.commit(SystemStateHelper.default.mutation.updateIsLoggedIn, true)


        if(token === '' || isLoggedIn === false) throw new Error("Unauthenticated.")

        axios.defaults.headers["Authorization"] = `Bearer ${token}`
        await AuthAPI.me().then( (data) => {
            context.store.commit(SystemStateHelper.default.mutation.updateAuthData, data)
            axios.defaults.headers["Authorization"] = `Bearer ${context.store.getters[SystemStateHelper.default.getter.getAuthToken]}`
        })
    } catch (error :any) {
        axios.defaults.headers['Authorization'] = null
        context.store.commit(SystemStateHelper.default.mutation.clearAuthData)
        context.store.commit(SystemStateHelper.default.mutation.updateIsLoggedIn, false)
        context.redirect('/auth/login')    
    }
}

export default authenticated