<template>
    <div class="d-contents">
        <v-data-table :headers="dataTableHeaders" :items="leaves" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:[`item.status`] = {item}>
                <v-chip :color="getColorForStatus(item.status)" v-text="item.status" dark small></v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class='mr-2' @click="onClickShowBtn(item)" color="info" title="Detail">mdi-eye</v-icon>
            </template>
        </v-data-table>

        <!-- Dialog Overtime Submission -->
        <v-dialog v-model="isFormDialogOpen" width="450px" persistent>
            <v-card :loading="isFormDialogLoading" :disabled="isFormDialogLoading">
                <v-toolbar color="primary" dark dense elevation="0">
                    Data Cuti Karyawan
                    <v-spacer />
                    <v-icon size="30" @click="closeFormDialog()" title="Tutup">mdi-close</v-icon>
                </v-toolbar>
                <v-card-text class="mt-4">
                    <v-container fluid class="pa-0">
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Nama Pegawai<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.employeeName || '-' }}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Tgl Awal<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.startDate || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Tgl Selesai<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.endDate || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Jenis Cuti<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.type || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Jumlah <div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.amount || '0'}} hari
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Alasan<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.reason || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Status<div class="float-right">:</div></v-col>
                            <v-col cols="8">
                                <v-chip :color="getColorForStatus(selectedDataTableItem.status || '')" v-text="selectedDataTableItem.status" dark small></v-chip>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="py-4">
                    <v-spacer></v-spacer>
                    <template v-if="selectedDataTableItem.status == LeaveStatus.Pengajuan">
                        <v-btn dark color="red" class="text-none" @click="onClickRejectBtn()" :disabled="isFormDialogLoading" depressed>
                            <v-icon size="20">mdi-close-outline</v-icon>&nbsp;Tolak
                        </v-btn>
                        <v-btn dark color="green" class="text-none" @click="onClickApproveBtn()" :disabled="isFormDialogLoading" depressed>
                            <v-icon size="20">mdi-check</v-icon>&nbsp;Setujui
                        </v-btn>
                    </template>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator'
import ConfirmationDialogComponent from '~/components/global/ConfirmationDialog.vue';
import LeaveStatus from '~/helper/enum/LeaveStatus';
import OvertimeStatus, { OvertimeStatusID } from '~/helper/enum/OvertimeStatus';
import SystemStateHelper from '~/helper/store/SystemState';
import LeaveAPI from '~/services/LeaveAPI';
import OvertimeAPI from '~/services/OvertimeAPI';

@Component({
    layout: "admin",
    head: {
        title: "Lembur Karyawan"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class OvertimeManagerPage extends Vue {
    isLoading: boolean = true
    isFormDialogOpen: boolean = false
    isFormDialogLoading: boolean = false
    leaves: Leave[] = []
    LeaveStatus = LeaveStatus
    selectedDataTableItem: Leave = {
        id: '',
        employeeName: '',
        startDate: '',
        endDate: '',
        reason: '',
        type: '',
        status: LeaveStatus.Pengajuan,
    }

    dataTableHeaders = [
        {text: 'Nama Pegawai', value: 'employeeName'},
        {text: 'Jenis Cuti', value: 'type'},
        {text: 'Alasan', value: 'reason'},
        {text: 'Tgl Awal', value: 'startDate'},
        {text: 'Tgl Akhir', value: 'endDate'},
        {text: 'Jumlah(Hari)', value: 'amount'},
        {text: 'Status', value: 'status'},
        {
            text: 'Aksi',
            value: 'actions',
            sortable: false,
            width: '75px'
        },
    ]

    getColorForStatus(status : string) : string {
        let _color = 'info'
        switch (status) {
            case 'Disetujui':
                _color = 'green'
            break;
            case 'Ditolak':
                _color = 'red'
            break;
        }
        return _color
    }

    onClickShowBtn(item : Leave) : void {
        this.isFormDialogOpen = true
        this.selectedDataTableItem = item
    }

    closeFormDialog (refreshData: boolean = false) :void {
        if(refreshData) this.fetchLeaves()

        this.isFormDialogOpen = false
        window.setTimeout( () => {
            this.selectedDataTableItem = {
                id: '',
                employeeName: '',
                startDate: '',
                endDate: '',
                reason: '',
                type: '',
                status: LeaveStatus.Pengajuan,
            }
        }, 1000)
    }

    onClickApproveBtn () : void {
        this.updateStatusLeave(this.selectedDataTableItem.id as string, OvertimeStatusID.Disetujui)
    }

    onClickRejectBtn () : void {
        this.updateStatusLeave(this.selectedDataTableItem.id as string, OvertimeStatusID.Ditolak)
    }

    fetchLeaves () : void {
        this.isLoading = true
        LeaveAPI.getEmployeLeave().then(data => {
            this.leaves = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    updateStatusLeave (uuid: string, status: number) : void {
        this.isFormDialogLoading = true
        LeaveAPI.updateStatus(uuid, status)
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeFormDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isFormDialogLoading = false)
    }

    mounted () {
        this.fetchLeaves()
    }

    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Cuti Karyawan")
    }
}
</script>