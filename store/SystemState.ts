import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { v4 } from 'uuid'
import { ToastMessage, ToastMessagePayload } from '~/helper/utilities/ToastHelper'
import Vue from 'vue'
import AuthAPI from '~/services/AuthAPI'
import axios from 'axios';

export const state = (): System.State => ({
    title : "",
    systemMessages : [],
    authData : {
        email: '',
        employePosition: '',
        fullname: '',
        role: '',
        token: ''
    },
    isLoggedIn: false
})

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, State> = {
    getTitle: state => state.title,
    getToastMessages: state => state.systemMessages,
    getAuthData: state => state.authData,
    getAuthToken: state => state.authData.token,
    getAuthRole: state => state.authData.role,
    getIsLoggedIn: state => state.isLoggedIn,
}

export const mutations: MutationTree<State> = {
    UPDATE_TITLE (state, payload: string) {
        state.title = payload
    },
    PUSH_MESSAGE (state, payload: ToastMessagePayload) {
        state.systemMessages.push({ id: v4(), ...payload })
    },
    REMOVE_MESSAGE (state, { id: messageId }: ToastMessage) {
        const targetIndex = state.systemMessages.findIndex(({id}) => id === messageId)
    
        if (targetIndex > -1) Vue.delete(state.systemMessages, targetIndex)
    },
    UPDATE_AUTH_DATA (state, payload: System.AuthData) {
        Vue.set(state, 'authData', payload)
    },
    UPDATE_IS_LOGGED_IN (state, payload : boolean) {
        Vue.set(state, 'isLoggedIn', payload)
    },
    CLEAR_AUTH_DATA (state) {
        Vue.set(state, 'authData', {
            email: '',
            employePosition: '',
            fullname: '',
            role: '',
            token: ''
        })
    }
}

export const actions: ActionTree<State, any> = {
    doLogin : async ({commit, getters}, payload: {email : string, password: string}) : Promise<void> => {
        return await AuthAPI.login(payload).then ( (data) => {
            commit('UPDATE_AUTH_DATA', data)
            commit('UPDATE_IS_LOGGED_IN', true)
            axios.defaults.headers['Authorization'] =`Bearer ${data.token}`
        })
    },
    logout : async ({commit, getters}) : Promise<void> => {
        return await AuthAPI.logout().then( () => {
            commit('CLEAR_AUTH_DATA')
            commit('UPDATE_IS_LOGGED_IN', false)
            axios.defaults.headers['Authorization'] = null
        })
    }
}