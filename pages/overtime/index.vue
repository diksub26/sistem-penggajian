<template>
    <div class="d-contents">
        <v-data-table :headers="dataTableHeaders" :items="overtimes" height="100%" :loading="isLoading" :items-per-page="25" 
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

        <!-- Dialog Overtime Submission -->
        <v-dialog v-model="isFormDialogOpen" width="400px" persistent>
            <v-form ref="overtimeSubmissionForm" v-model="isFormDialogValid" lazy-validation @submit.prevent="onFormDialogSubmitted">
                <v-card :loading="isFormDialogLoading" :disabled="isFormDialogLoading">
                    <v-toolbar color="primary" dark dense elevation="0">Form Pengajuan Lembur</v-toolbar>
                    <v-card-text>
                        <v-container fluid class="pa-0">
                            <v-row dense>
                                <v-col cols="12" class="px-2">
                                    <v-select label="Manajer" v-model="form.manager" :items="managers"  :rules="[inputFieldRequiredRules]" autofocus/>
                                    <v-text-field label="Tanggal" v-model="form.date" type="date" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Jam Mulai" v-model="form.startTime" type="time" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Jam Selesai" v-model="form.endTime" type="time" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Project" v-model="form.project" :rules="[inputFieldRequiredRules]" />
                                    <v-textarea label="Deskripsi" v-model="form.description" :rules="[inputFieldRequiredRules]" :rows="2"/>
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
import OvertimeAPI from '../../services/OvertimeAPI';

@Component({
    layout: "admin",
    head: {
        title: "Pengajuan Lembur"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class OvertimeSubmission extends Vue {
    isLoading: boolean = true
    isFormDialogOpen: boolean = false
    isFormDialogValid: boolean = true
    isFormDialogLoading: boolean = false
    managers: {text: '', value: ''}[] = []
    overtimes: Overtime[] = []

    form: Overtime = {
        date: '',
        description: '',
        manager: '',
        project: '',
        startTime: '',
        endTime: '',
    }

    dataTableHeaders = [
        { text: "Tgl Lembur", value:'date'},
        { text: "Jam", value:'time'},
        { text: "Project", value:'project'},
        { text: "Deskripsi", value:'description'},
        { text: "Nama Manager", value:'managerName'},
        { text: "Status", value:'status'},
    ]

    $refs!: {
        overtimeSubmissionForm: HTMLFormElement;
    }

    inputFieldRequiredRules = (v : any) =>  !!v|| 'Item Ini Wajib diisi'

    onClickCreateSubmisionBtn () : void {
        this.isFormDialogOpen = true
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.overtimeSubmissionForm.validate()) return

        this.isFormDialogLoading = true
        OvertimeAPI.post(this.form).then( resp => {
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

    closeFormDialog (refreshData : boolean = false) : void {
        if(refreshData) this.fetchOvertimes()

        this.isFormDialogOpen = false
        this.$refs.overtimeSubmissionForm.reset()        
        this.$refs.overtimeSubmissionForm.resetValidation()        
    }

    fetchOvertimes () : void {
        this.isLoading = true
        OvertimeAPI.get().then(data => {
            this.overtimes = data
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

    getColorForStatus(status : string) : string {
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
        this.fetchOvertimes()
        this.fetchDataManagers()
    }
    
    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Pengajuan Lembur")
    }
}
</script>