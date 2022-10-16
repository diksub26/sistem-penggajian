<template>
    <v-dialog v-model="isConfirmationDialogOpen" width="500px" persistent>
        <v-card :loading="isConfirmDialogLoading" :disabled="isConfirmDialogLoading">
            <v-card-text class="text-center pt-4 grey--text text--darken-2">
                <v-icon size="75" color="orange">mdi-alert</v-icon>
                <div class="text-subtitle-2 mt-2">{{ title }}</div>
                <div class="text-subtitle-1 font-weight-bold">
                    {{ description }}
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="error" class="text-none" @click="closeDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark small color="green" class="text-none" @click="onClickConfirmBtn()" :loading="isConfirmDialogLoading">
                    <v-icon size="20">mdi-check</v-icon>&nbsp;{{ buttonConfirmationText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ConfirmationDialogComponent extends Vue{
    isConfirmationDialogOpen: boolean = false
    isConfirmDialogLoading: boolean = false

    @Prop({ type: String, default: "Apakah anda yakin ?"}) readonly title!: string
    @Prop({ type: String, default: "Data yang dihapus tidak dapat dikembalikan." }) readonly description!: string
    @Prop({ type: String, default: "Ya, Hapus" }) readonly buttonConfirmationText!: string

    @Prop({ type: Boolean, required: true })
    readonly value!: boolean

    @Prop()
    readonly confirmDialogCallback!: () => Promise<void>

    @Watch('value')
    onValuePropChanges (value: boolean): void {
        this.isConfirmationDialogOpen = value
    }

    @Watch('isConfirmationDialogOpen')
    onisConfirmationDialogOpenChanges (value: boolean): void {
        this.$emit('input', value)
    }

    closeDialog () : void {
        this.isConfirmationDialogOpen = false
        this.isConfirmDialogLoading = false
    }

    async onClickConfirmBtn () : Promise<void> {
        this.isConfirmDialogLoading = true
        await this.confirmDialogCallback().finally( () => this.isConfirmDialogLoading = false)

        this.closeDialog()
    }
}
</script>