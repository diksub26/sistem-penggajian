import { Plugin } from '@nuxt/types'
import * as SystemStateHelper from '~/helper/store/SystemState'
import * as LogoutChannelHelper from '~/helper/LogoutChannel'
import { AxiosError } from 'axios';

const Auth: Plugin = ({ store, $logoutChannel, app, $notifier }, inject) => { 
    inject('auth', {
        logout: async () => {
            await store.dispatch(SystemStateHelper.default.action.logout).then( async () => {
                await app.router?.push('/auth/login')
                $logoutChannel.postMessage<LogoutChannelHelper.MessagePayload<any>>({
                    type: LogoutChannelHelper.MessageType.LOGOUT
                })
            }).catch ( (error : any) => {
                let _errMessage = error.message
                if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
                $notifier.showMessage({ content: _errMessage, color: "error"})
            })
        },
        doLogin: async (payload : {email : string, password: string}) => {
            return await store.dispatch(SystemStateHelper.default.action.doLogin, payload).then( () => {
                app.router?.push('/')
            })
        }
    })
}

export default Auth