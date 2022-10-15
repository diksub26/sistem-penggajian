<template>
    <v-data-table :headers="dataTableHeaders" :items="masterEmployeePositions" height="100%" loading="isLoading" :items-per-page="25" 
            :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
        >
        <template v-slot:top>
            <v-toolbar flat>
                <v-btn color="blue" dark depressed small class="text-none"><v-icon>mdi-plus</v-icon> Tambah Data</v-btn>
            </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="onClickEditBtn(item)">mdi-pencil</v-icon>
            <v-icon small @click="onClickDeleteBtn(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:[`item.salary`]="{ item }">{{ formatSalary(item.salary) }}</template>
    </v-data-table>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import SystemStateHelper from '~/helper/store/SystemState';
import MasterEmployeePositionAPI from '../../../services/MasterEmployeePositionAPI';

@Component({
    layout: "admin",
    head: {
        title: "Master Data Jabatan"
    }
})
export default class MasterJabatanIndexPage extends Vue{
    selectedDataTableItem! : MasterData.EmployeePosition
    dataTableHeaders = [
        {
            text: 'Nama Jabatan',
            value: 'name'
        },
        {
            text: 'Gaji Pokok',
            value: 'salary',
            width: '30%',
        },
        {
            text: '',
            value: 'actions',
            sortable: false,
            width: '100px'
        },
    ]
    masterEmployeePositions : MasterData.EmployeePosition[] = []
    isLoading: boolean = false

    onClickEditBtn (item : MasterData.EmployeePosition): void {
        this.selectedDataTableItem = item
    }

    onClickDeleteBtn (item : MasterData.EmployeePosition): void {
        this.selectedDataTableItem = item
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
 
    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Master Data Jabatan")
    }

    mounted () {
        this.fetchMasterEmployePosition()
    }
}
</script>