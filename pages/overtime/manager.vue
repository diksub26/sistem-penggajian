<template>
    <div class="d-contents">
        <v-data-table :headers="dataTableHeaders" :items="overtimes" height="100%" :loading="isLoading" :items-per-page="25" 
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
                    Data Lembur Karyawan
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
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Tgl Lembur<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.date || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Jam Mulai<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.startTime || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Jam Selesai<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.endTime || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Project<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.project || '-'}}
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="4" class="text-caption grey--text text--darken-3">Deskripsi<div class="float-right">:</div></v-col>
                            <v-col cols="8" class="text-body-2 grey--text text--darken-3">
                                {{ selectedDataTableItem.description || '-'}}
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
                    <template v-if="selectedDataTableItem.status == OvertimeStatus.Pengajuan">
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
import OvertimeStatus, { OvertimeStatusID } from '~/helper/enum/OvertimeStatus';
import SystemStateHelper from '~/helper/store/SystemState';
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
    overtimes: Overtime[] = []
    OvertimeStatus = OvertimeStatus
    selectedDataTableItem: Overtime = {
        id: '',
        employeeName: '',
        date: '',
        time: '',
        startTime: '',
        endTime: '',
        project: '',
        description: '',
        status: OvertimeStatus.Pengajuan,
    }

    dataTableHeaders = [
        { text: "Nama Pegawai", value:'employeeName'},
        { text: "Tgl Lembur", value:'date'},
        { text: "Jam", value:'time'},
        { text: "Project", value:'project'},
        { text: "Deskripsi", value:'description'},
        { text: "Status", value:'status'},
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

    onClickShowBtn(item : Overtime) : void {
        this.isFormDialogOpen = true
        this.selectedDataTableItem = item
    }

    closeFormDialog (refreshData: boolean = false) :void {
        if(refreshData) this.fetchOvertimes()

        this.isFormDialogOpen = false
        window.setTimeout( () => {
            this.selectedDataTableItem = {
                id: '',
                employeeName: '',
                date: '',
                time: '',
                startTime: '',
                endTime: '',
                project: '',
                description: '',
                status: OvertimeStatus.Pengajuan,
            }
        }, 1000)
    }

    onClickApproveBtn () : void {
        this.updateStatusOvertime(this.selectedDataTableItem.id as string, OvertimeStatusID.Disetujui)
    }

    onClickRejectBtn () : void {
        this.updateStatusOvertime(this.selectedDataTableItem.id as string, OvertimeStatusID.Ditolak)
    }

    fetchOvertimes () : void {
        this.isLoading = true
        OvertimeAPI.getEmployeOvertime().then(data => {
            this.overtimes = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    updateStatusOvertime (uuid: string, status: number) : void {
        this.isFormDialogLoading = true
        OvertimeAPI.updateStatus(uuid, status)
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
        this.fetchOvertimes()
    }

    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Lembur Karyawan")
    }
}
</script>