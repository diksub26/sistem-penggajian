<template>
    <div style="display:contents">
        <v-data-table :headers="dataTableHeaders" :items="masterAllowances" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-btn color="blue" dark depressed small class="text-none" @click="onClickAddBtn()"><v-icon>mdi-plus</v-icon> Tambah Data</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="onClickEditBtn(item)" color="green">mdi-pencil</v-icon>
                <v-icon small @click="onClickDeleteBtn(item)" color="error">mdi-delete</v-icon>
            </template>
            <template v-slot:[`item.amount`]="{ item }">{{ formatAmount(item.amount) }}</template>
        </v-data-table>
        <v-dialog v-model="isFormDialogOpen" width="450px" persistent>
            <v-form ref="form" v-model="isFormDialogValid" lazy-validation @submit.prevent="onFormDialogSubmitted">
                <v-card :loading="isFormDialogLoading" :disabled="isFormDialogLoading">
                    <v-toolbar color="primary" dark dense>Form Master Tunjangan Gaji</v-toolbar>
                    <v-card-text class="pa-2 mt-2">
                        <v-container fluid class="pa-2">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Nama Tunjangan" dense v-model="selectedDataTableItem.name" autofocus :rules="[inputFieldRequiredRules]"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Jumlah" type="number" dense v-model="selectedDataTableItem.amount" :rules="[inputFieldRequiredRules]"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="error" class="text-none" @click="closeFormDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn dark depressed color="green" class="text-none" type="submit" :loading="isFormDialogLoading">
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Simpan{{ isCreateNewData ? '' : ' Perubahan'}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <ConfirmationDialogComponent :confirmDialogCallback="deleteAllowance.bind()" v-model="isDeleteConfirmationOpen"/>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import SystemStateHelper from '~/helper/store/SystemState';
import MasterAllowanceAPI from '../../../services/MasterAllowanceAPI';
import ConfirmationDialogComponent from '../../../components/global/ConfirmationDialog.vue';

@Component({
    layout: "admin",
    head: {
        title: "Master Tunjangan Gaji"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class MasterJabatanIndexPage extends Vue{
    selectedDataTableItem : MasterData.Allowance = {
        id: '',
        name: '',
        amount: 0
    }
    dataTableHeaders = [
        {
            text: 'Nama Tunjangan',
            value: 'name'
        },
        {
            text: 'Jumlah',
            value: 'amount',
            width: '25%',
        },
        {
            text: 'Aksi',
            value: 'actions',
            sortable: false,
            width: '100px'
        },
    ]
    masterAllowances : MasterData.Allowance[] = []
    isLoading: boolean = false
    isFormDialogOpen: boolean = false
    isCreateNewData: boolean = true
    isFormDialogLoading: boolean = false
    isFormDialogValid: boolean = true
    isDeleteConfirmationOpen: boolean = false

    $refs!: {
        form: HTMLFormElement;
    }

    inputFieldRequiredRules = (v : any) =>  !!v|| 'Item Ini Wajib diisi'

    onClickEditBtn (item : MasterData.Allowance): void {
        this.selectedDataTableItem = item
        this.isCreateNewData = false
        this.openFormDialog()
    }

    onClickDeleteBtn (item : MasterData.Allowance): void {
        this.selectedDataTableItem = item
        this.isDeleteConfirmationOpen = true
    }

    onClickAddBtn () : void {
        this.openFormDialog()
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.form.validate()) return

        if(this.isCreateNewData) this.storeAllowance()
        else this.updateAllowance()
    }

    closeFormDialog (refreshData : boolean = false) :void {
        if(refreshData) this.fetchMasterAllowance()
        
        this.isFormDialogOpen = false
        this.selectedDataTableItem = {
            id: '',
            name: '',
            amount: 0
        }
        this.isCreateNewData = true
        this.$refs.form.resetValidation()
    }

    openFormDialog () :void {
        this.isFormDialogOpen = true
    }

    async fetchMasterAllowance () : Promise<void> {
        this.isLoading = true
        await MasterAllowanceAPI.get().then ( (data) => {
            this.masterAllowances = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    formatAmount (amount : number) {
        const formattedAmount = amount ? new Intl.NumberFormat('id-ID').format(amount) : 0

        return `Rp. ${formattedAmount}`
    }

    async updateAllowance () : Promise<void> {
        const { id, name, amount} = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await MasterAllowanceAPI.put(this.selectedDataTableItem.id, { name, amount })
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeFormDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isFormDialogLoading = false)
    }

    async storeAllowance () : Promise<void> {
        const { name, amount} = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await MasterAllowanceAPI.post({ name, amount })
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeFormDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isFormDialogLoading = false)
    }

    async deleteAllowance () : Promise<void> {
        const { id } = this.selectedDataTableItem

        await MasterAllowanceAPI.destroy(id)
        .then( resp => {
            this.selectedDataTableItem = {
                id: '',
                name: '',
                amount: 0
            }
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.fetchMasterAllowance()
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }
 
    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Master Tunjangan Gaji")
    }

    mounted () {
        this.fetchMasterAllowance()
    }
}
</script>