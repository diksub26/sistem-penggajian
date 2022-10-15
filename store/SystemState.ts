import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = (): System.State => ({
    title : ""
})

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, State> = {
    getTitle: state => state.title,
}

export const mutations: MutationTree<State> = {
    UPDATE_TITLE (state, payload: string) {
        state.title = payload
    },
}