<template>
    <div style="display:contents">
        <v-data-table :headers="dataTableHeaders" :items="masterEmployeePositions" height="100%" :loading="isLoading" :items-per-page="25" 
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
            <template v-slot:[`item.salary`]="{ item }">{{ formatSalary(item.salary) }}</template>
        </v-data-table>
        <v-dialog v-model="isFormDialogOpen" width="450px" persistent>
            <v-form ref="form" v-model="isFormDialogValid" lazy-validation @submit.prevent="onFormDialogSubmitted">
                <v-card :loading="isFormDialogLoading" :disabled="isFormDialogLoading">
                    <v-toolbar color="primary" dark dense>Form Master Jabatan</v-toolbar>
                    <v-card-text class="pa-2 mt-2">
                        <v-container fluid class="pa-2">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Nama Jabatan" dense v-model="selectedDataTableItem.name" autofocus :rules="[inputFieldRequiredRules]"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Gaji Pokok" type="number" dense v-model="selectedDataTableItem.salary" :rules="[inputFieldRequiredRules]"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="error" class="text-none" @click="closeFormDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn dark color="green" class="text-none" type="submit" :loading="isFormDialogLoading">
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Simpan{{ isCreateNewData ? '' : ' Perubahan'}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <ConfirmationDialogComponent :confirmDialogCallback="deleteEmployeePosition.bind()" v-model="isDeleteConfirmationOpen"/>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import SystemStateHelper from '~/helper/store/SystemState';
import MasterEmployeePositionAPI from '../../../services/MasterEmployeePositionAPI';
import ConfirmationDialogComponent from '../../../components/global/ConfirmationDialog.vue';

@Component({
    layout: "admin",
    head: {
        title: "Master Data Jabatan"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class MasterJabatanIndexPage extends Vue{
    selectedDataTableItem : MasterData.EmployeePosition = {
        id: '',
        name: '',
        salary: 0
    }
    dataTableHeaders = [
        {
            text: 'Nama Jabatan',
            value: 'name'
        },
        {
            text: 'Gaji Pokok',
            value: 'salary',
            width: '25%',
        },
        {
            text: 'Aksi',
            value: 'actions',
            sortable: false,
            width: '100px'
        },
    ]
    masterEmployeePositions : MasterData.EmployeePosition[] = []
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

    onClickEditBtn (item : MasterData.EmployeePosition): void {
        this.selectedDataTableItem = item
        this.isCreateNewData = false
        this.openFormDialog()
    }

    onClickDeleteBtn (item : MasterData.EmployeePosition): void {
        this.selectedDataTableItem = item
        this.isDeleteConfirmationOpen = true
    }

    onClickAddBtn () : void {
        this.openFormDialog()
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.form.validate()) return

        if(this.isCreateNewData) this.storeEmployeePosition()
        else this.updateEmployeePosition()
    }

    closeFormDialog (refreshData : boolean = false) :void {
        if(refreshData) this.fetchMasterEmployePosition()
        
        this.isFormDialogOpen = false
        this.selectedDataTableItem = {
            id: '',
            name: '',
            salary: 0
        }
        this.isCreateNewData = true
        this.$refs.form.resetValidation()
    }

    openFormDialog () :void {
        this.isFormDialogOpen = true
    }

    async fetchMasterEmployePosition () : Promise<void> {
        this.isLoading = true
        await MasterEmployeePositionAPI.get().then ( (data) => {
            this.masterEmployeePositions = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    formatSalary (salary : number) {
        const formattedSalary = salary ? new Intl.NumberFormat('id-ID').format(salary) : 0

        return `Rp. ${formattedSalary}`
    }

    async updateEmployeePosition () : Promise<void> {
        const { id, name, salary} = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await MasterEmployeePositionAPI.put(this.selectedDataTableItem.id, { name, salary })
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

    async storeEmployeePosition () : Promise<void> {
        const { name, salary} = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await MasterEmployeePositionAPI.post({ name, salary })
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

    async deleteEmployeePosition () : Promise<void> {
        const { id } = this.selectedDataTableItem

        await MasterEmployeePositionAPI.destroy(id)
        .then( resp => {
            this.selectedDataTableItem = {
                id: '',
                name: '',
                salary: 0
            }
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.fetchMasterEmployePosition()
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }
 
    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Master Data Jabatan")
    }

    mounted () {
        this.fetchMasterEmployePosition()
    }
}
</script>