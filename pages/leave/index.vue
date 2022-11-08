<template>
    <div class="d-contents">
        <v-data-table :headers="dataTableHeaders" :items="leaves" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-btn color="blue" dark depressed small class="text-none" @click="onClickCreateSubmisionBtn()"><v-icon>mdi-plus</v-icon> Buat Pengajuan</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:[`item.status`] = {item}>
                <v-chip :color="getColorForStatus(item.status)" v-text="item.status" dark small></v-chip>
            </template>
        </v-data-table>

        <!-- Dialog Leave Submission -->
        <v-dialog v-model="isFormDialogOpen" width="400px" persistent>
            <v-form ref="leaveSubmissionForm" v-model="isFormDialogValid" lazy-validation @submit.prevent="onFormDialogSubmitted">
                <v-card :loading="isFormDialogLoading" :disabled="isFormDialogLoading">
                    <v-toolbar color="primary" dark dense elevation="0">Form Pengajuan Lembur</v-toolbar>
                    <v-card-text>
                        <v-container fluid class="pa-0">
                            <v-row dense>
                                <v-col cols="12" class="px-2">
                                    <v-select label="Manajer" v-model="form.manager" :items="managers"  :rules="[inputFieldRequiredRules]" autofocus/>
                                    <v-text-field label="Tanggal Mulai" v-model="form.startDate" type="date" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Tanggal Akhir" v-model="form.endDate" type="date" :rules="[inputFieldRequiredRules]" />
                                    <v-select label="Jenis Cuti" v-model="form.type" :items="leaaveTypes"  :rules="[inputFieldRequiredRules]"/>
                                    <v-textarea label="Alasan" v-model="form.reason" :rules="[inputFieldRequiredRules]" :rows="4"/>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-btn text color="error" class="text-none" @click="closeFormDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn dark color="green" class="text-none" type="submit" :loading="isFormDialogLoading" depressed>
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Submit
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import ConfirmationDialogComponent from '~/components/global/ConfirmationDialog.vue';
import SystemStateHelper from '~/helper/store/SystemState';
import EmployeeAPI from '~/services/Employee';
import LeaveAPI from '~/services/LeaveAPI';

@Component({
    layout: 'admin',
    head: {
        title: "Pengajuan Lembur"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class LeaveSubmission extends Vue {
    isLoading: boolean = true
    isFormDialogOpen: boolean = false
    isFormDialogValid: boolean = true
    isFormDialogLoading: boolean = false
    leaves: Leave[] = []
    managers: {text: string, value: string}[] = []
    dataTableHeaders = [
        {text: 'Jenis Cuti', value: 'type'},
        {text: 'Alasan', value: 'reason'},
        {text: 'Tgl Awal', value: 'startDate'},
        {text: 'Tgl Akhir', value: 'endDate'},
        {text: 'Jumlah(Hari)', value: 'amount'},
        {text: 'Nama Manajer', value: 'managerName'},
        {text: 'Status', value: 'status'},
    ]

    $refs!: {
        leaveSubmissionForm: HTMLFormElement;
    }

    form: Leave = {
        startDate: '',
        endDate: '',
        manager: '',
        reason: '',
        type: 1
    }

    leaaveTypes = [
        {text: 'Cuti Tahunan', value: '1'},
        {text: 'Melahirkan', value: '2'},
        {text: 'Menikah', value: '3'},
        {text: 'Beribadah', value: '4'},
        {text: 'Lainnya', value: '5'},
    ]
    
    inputFieldRequiredRules = (v : any) =>  !!v|| 'Item Ini Wajib diisi'

    onClickCreateSubmisionBtn () :void {
        this.isFormDialogOpen = true
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.leaveSubmissionForm.validate()) return

        this.isFormDialogLoading = true
        LeaveAPI.post(this.form).then( resp => {
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

    closeFormDialog (refreshData : boolean = false) :void {
        if(refreshData) this.fetchLeaves()

        this.isFormDialogOpen = false
        this.$refs.leaveSubmissionForm.reset()        
        this.$refs.leaveSubmissionForm.resetValidation() 
    }

    fetchLeaves () : void {
        this.isLoading = true
        LeaveAPI.get().then(data => {
            this.leaves = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    fetchDataManagers () : void {
        EmployeeAPI.getManagers().then(data => {
            this.managers = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }

    getColorForStatus(status: string) : string {
        let _color = 'grey'
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

    mounted () {
        this.fetchLeaves()
        this.fetchDataManagers()
    }

    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Pengajuan Cuti")
    }
}
</script>