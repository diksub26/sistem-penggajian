<template>
  <div class="SnackbarHolder">
    <v-snackbar v-for="{id, content, color, position} in toastMessages" :key="id" :color="color || 'default'" :top="position" :value="toastMessagesOptionMap[id].isOpen">
      <div v-html="content"></div>
      <template v-slot:action>
        <v-btn text @click="toastMessagesOptionMap[id].isOpen = false">Tutup</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters, mapMutations } from 'vuex'
import { ToastMessage, ToastPosition, TOAST_BOTTOM, TOAST_TOP } from '~/helper/utilities/ToastHelper'

@Component({
    computed: {
        ...mapGetters('SystemState', ['getToastMessages'])
    },
    methods: {
        ...mapMutations('SystemState', ['REMOVE_MESSAGE'])
    }
})
export default class SnackbarHolder extends Vue {
    toastMessages: ToastMessage[] = []
    toastMessagesOptionMap: {
        [toastId: string]: {
        isOpen: boolean;
        timer: number;
        timerId: number;
        }
    } = {}

    getToastMessages!: ToastMessage[]

    REMOVE_MESSAGE!: (toastMessage: ToastMessage) => void

    @Watch('getToastMessages', { deep: true })
    onGetToastMessagesChanges (values: ToastMessage[]): void {
        if (values && values.length) {
        values.forEach(({ id, timeout }) => {
            if (!(id in this.toastMessagesOptionMap)) {
            let initialRun = true
            this.$set(this.toastMessagesOptionMap, id, { isOpen: false, timer: timeout || 5000, timerId: 0 })

            this.toastMessagesOptionMap[id].timerId = window.setInterval(() => {
                if (this.toastMessagesOptionMap[id].timer > 0) {
                this.toastMessagesOptionMap[id].timer -= 1000
                } else {
                this.toastMessagesOptionMap[id].isOpen = false
                clearInterval(this.toastMessagesOptionMap[id].timerId)

                const toastMessageData = this.toastMessages.find(({id: existToastId}) => existToastId === id)
                if (toastMessageData) {
                    this.REMOVE_MESSAGE(toastMessageData)
                    this.$nextTick(() => {
                    this.$delete(this.toastMessagesOptionMap, id)
                    })
                }
                }
            }, 1000)

            this.$nextTick(()=> { this.toastMessagesOptionMap[id].isOpen = true })
            }
        })
        }

        this.toastMessages = values
    }

    isToastTop (toastPosition: ToastPosition) {
        return toastPosition === TOAST_TOP
    }

    isToastBottom (toastPosition: ToastPosition) {
        return toastPosition === TOAST_BOTTOM
    }
}
</script>

<style>

</style>