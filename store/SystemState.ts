import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { v4 } from 'uuid'
import { ToastMessage, ToastMessagePayload } from '~/helper/utilities/ToastHelper'
import Vue from 'vue'

export const state = (): System.State => ({
    title : "",
    systemMessages : []
})

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, State> = {
    getTitle: state => state.title,
    getToastMessages: state => state.systemMessages
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
    }
}