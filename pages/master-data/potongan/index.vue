<template>
    <div style="display:contents">
        <v-data-table :headers="dataTableHeaders" :items="masterSalaryCuts" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-btn color="blue" dark depressed small class="text-none" @click="onClickAddBtn()"><v-icon>mdi-plus</v-icon>&nbsp;Tambah Data</v-btn>
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
                    <v-toolbar color="primary" dark dense>
                        Form Master Potongan Gaji
                        <v-spacer />
                        <v-icon size="30" @click="closeFormDialog()">mdi-close</v-icon>
                    </v-toolbar>
                    <v-card-text class="pa-2 mt-2">
                        <v-container fluid class="pa-2">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Nama Potongan" dense v-model="selectedDataTableItem.name" autofocus :rules="[inputFieldRequiredRules]"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Jumlah" type="number" dense v-model="selectedDataTableItem.amount" :rules="[inputFieldRequiredRules]"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="Type" type="number" dense v-model="selectedDataTableItem.type" :items="typeItems" :rules="[inputFieldRequiredRules]" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn dark depressed color="green" class="text-none" type="submit" :loading="isFormDialogLoading" small>
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Simpan{{ isCreateNewData ? '' : ' Perubahan'}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <ConfirmationDialogComponent :confirmDialogCallback="deleteSalaryCut" v-model="isDeleteConfirmationOpen"/>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import SystemStateHelper from '~/helper/store/SystemState';
import MasterSalaryCutAPI from '~/services/MasterSalaryCutAPI';
import ConfirmationDialogComponent from '~/components/global/ConfirmationDialog.vue';

@Component({
    layout: "admin",
    head: {
        title: "Master Potongan Gaji"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class MasterJabatanIndexPage extends Vue{
    selectedDataTableItem : MasterData.SalaryCut = {
        id: '',
        name: '',
        amount: 0,
        type: ''
    }
    dataTableHeaders = [
        {
            text: 'Nama Potongan',
            value: 'name'
        },
        {
            text: 'Jumlah',
            value: 'amount',
            width: '25%',
        },
        {
            text: 'Type',
            value: 'type',
        },
        {
            text: 'Aksi',
            value: 'actions',
            sortable: false,
            width: '100px'
        },
    ]
    typeItems = [
        { text: "Persentase", value: 'percentage'},
        { text: "Nominal", value: 'amount'}
    ]

    masterSalaryCuts : MasterData.SalaryCut[] = []
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

    onClickEditBtn (item : MasterData.SalaryCut): void {
        this.selectedDataTableItem = item
        this.isCreateNewData = false
        this.openFormDialog()
    }

    onClickDeleteBtn (item : MasterData.SalaryCut): void {
        this.selectedDataTableItem = item
        this.isDeleteConfirmationOpen = true
    }

    onClickAddBtn () : void {
        this.openFormDialog()
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.form.validate()) return

        if(this.isCreateNewData) this.storeSalaryCut()
        else this.updateSalaryCut()
    }

    closeFormDialog (refreshData : boolean = false) :void {
        if(refreshData) this.fetchMasterSalaryCut()
        
        this.isFormDialogOpen = false
        this.selectedDataTableItem = {
            id: '',
            name: '',
            amount: 0,
            type: ''
        }
        this.isCreateNewData = true
        this.$refs.form.resetValidation()
    }

    openFormDialog () :void {
        this.isFormDialogOpen = true
    }

    async fetchMasterSalaryCut () : Promise<void> {
        this.isLoading = true
        await MasterSalaryCutAPI.get().then ( (data) => {
            this.masterSalaryCuts = data
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

    async updateSalaryCut () : Promise<void> {
        const { id, name, amount, type} = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await MasterSalaryCutAPI.put(this.selectedDataTableItem.id, { name, amount, type })
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

    async storeSalaryCut () : Promise<void> {
        const { name, amount, type} = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await MasterSalaryCutAPI.post({ name, amount, type })
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

    async deleteSalaryCut () : Promise<void> {
        const { id } = this.selectedDataTableItem

        await MasterSalaryCutAPI.destroy(id)
        .then( resp => {
            this.selectedDataTableItem = {
                id: '',
                name: '',
                amount: 0,
                type: ''
            }
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.fetchMasterSalaryCut()
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }
 
    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Master Potongan Gaji")
    }

    mounted () {
        this.fetchMasterSalaryCut()
    }
}
</script>