<template>
    <div class="d-contents">
        <div class="text-h5 ml-2">Data Absensi Bulan {{ getThisMonthString }}</div>
        <div class="text-display-1 ml-2">Jumlah Hari Kerja : {{ dayOfWork || '-' }}</div>
        <v-data-table :headers="dataTableHeaders" :items="attendances" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-btn color="green" dark depressed small class="text-none mr-2" @click="onClickBtnDownloadTemplate()" :loading="isBtnDownloadTemplateLoading"><v-icon>mdi-download</v-icon> Download Template</v-btn>
                    <v-btn color="blue" dark depressed small class="text-none" @click="onClickBtnImport()"><v-icon>mdi-database-import-outline</v-icon> Import Rekap Absensi</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:[`item.basicSalary`]="{ item }">{{ formatRupiah(item.basicSalary) }}</template>
            <template v-slot:[`item.salaryStatus`]="{ item }">
                <v-chip :color="getColorForStatus(item.salaryStatus)" v-text="item.salaryStatus" dark small></v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class='mr-2' @click="onClickShowBtn(item.id)" color="info" title="Detail">mdi-eye</v-icon>
            </template>
        </v-data-table>

        <!-- Dialog Import Attendance -->
        <v-dialog v-model="importAttendanceDialog.isOpen" max-width="600px" persistent>
            <v-card :loading="importAttendanceDialog.isLoading" :disabled="importAttendanceDialog.isLoading" v-if="!importAttendanceDialog.isAlreadySubmitted">
                <v-form @submit.prevent="onFormImportSubmitted" ref="formImportAttendance">
                    <v-toolbar color="primary" dark dense elevation="0">
                        Import Absensi Karyawan
                        <v-spacer />
                        <v-icon size="30" @click="closeImportAttendanceDialog()" title="Tutup">mdi-close</v-icon>
                    </v-toolbar>
                    <v-card-text class="mt-4">
                        <v-container fluid class="pa-0">
                            <v-row dense>
                                <v-col cols="12" md="4">
                                    <v-text-field color="primary" label="Jumlah Hari Kerja" type="number"
                                        v-model="importAttendanceDialog.form.dayOfWork" :rules="[inputFieldRequiredRules]"
                                    />
                                </v-col>
                                <v-col>
                                    <v-file-input color="primary" label="File Import" type="file" ref="inputFileImport"
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        v-model="importAttendanceDialog.form.file" :rules="[inputFieldRequiredRules]"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="py-4">
                        <v-spacer></v-spacer>
                        <v-btn dark color="green" class="text-none" type="submit" :disabled="importAttendanceDialog.isLoading" depressed>
                            <v-icon size="20">mdi-upload</v-icon>&nbsp;Import
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
            <v-card calss="CardImportResult" v-else>
                <v-toolbar color="primary" dark dense elevation="0">
                    Import Absensi Karyawan
                    <v-spacer />
                    <v-icon size="30" @click="closeImportAttendanceDialog(true)" title="Tutup">mdi-close</v-icon>
                </v-toolbar>
                <v-card-text class="text-center pt-6">
                    <v-icon size="50" color="info">mdi-information-outline</v-icon>
                    <div class="text-h5">Import Absensi Selesai</div>
                    <div class="text-display-1">{{ importAttendanceDialog.importStatus }}</div>

                    <template v-if="importAttendanceDialog.error.length > 0">
                        <v-list two-line subheader>
                            <v-subheader class="error--text font-weight-bold text-h6">List Error :</v-subheader>
                            <v-list-item v-for="(error, index) in importAttendanceDialog.error" :key="index">
                                <v-list-item-content class="text-left pt-0">
                                    <v-list-item-title>Error Pada Baris ke {{ error.row || '-'}}</v-list-item-title>
                                    <v-list-item-subtitle>{{ error.message || '-'}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </template>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator'
import SystemStateHelper from '~/helper/store/SystemState';
import AttendanceAPI from '~/services/AttendanceAPI';
import { formatRupiah } from '~/helper/utilities/NumberFormatter'
import SalaryStatus from '~/helper/enum/SalaryStatus';

@Component({
    layout: "admin",
    head: {
        title: "Kelola Gaji Karyawan"
    }
})
export default class ManageSalaryPage extends Vue {
    isLoading : boolean = true
    isBtnDownloadTemplateLoading : boolean = false
    dayOfWork : string | null = null

    attendances : Attendance[] = []
    dataTableHeaders = [
        { text: 'No. Induk', value: 'noInduk' },
        { text: 'Nama Lengkap', value: 'employeeName' },
        { text: 'Gaji Pokok', value: 'basicSalary' },
        { text: 'Hadir', value: 'attend' },
        { text: 'Terlambat', value: 'late' },
        { text: 'Sakit', value: 'sick' },
        { text: 'Izin', value: 'permitte' },
        { text: 'Cuti', value: 'leave' },
        { text: 'Status Gaji', value: 'salaryStatus' },
        {
            text: 'Aksi',
            value: 'actions',
            sortable: false,
            width: '60px'
        },
    ]
    importAttendanceDialog : {
        isOpen: boolean,
        isLoading: boolean,
        isAlreadySubmitted : boolean
        form: {
            dayOfWork : string,
            file: File | null
        },
        importStatus: string
        error: any[],
    }= {
        isOpen : false,
        isLoading: false,
        isAlreadySubmitted : false,
        form : {
            dayOfWork : '20',
            file: null
        },
        importStatus: '',
        error: [],
    }

    get getThisMonthString () :string {
        const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long'});

        return formatter.format(new Date())
    }

    $refs! : {
        formImportAttendance : HTMLFormElement,
        inputFileImport : HTMLInputElement
    }

    formatRupiah: (amount: number) => string = formatRupiah
    inputFieldRequiredRules = (v : any) =>  !!v|| 'Item Ini Wajib diisi'

    getColorForStatus (status: SalaryStatus) : string {
        let color = 'warning'
        if(status === SalaryStatus.Transferred) color = 'green'
        return color
    }

    onClickBtnImport () : void {
        this.importAttendanceDialog.form.dayOfWork = this.dayOfWork || '20'
        this.importAttendanceDialog.isOpen = true
    }

    closeImportAttendanceDialog (isRefreshAttendance = false ) : void {
        if(isRefreshAttendance) {
            this.fetchAttendance()
            this.fetchSavedDayOfWork()
        }

        if(!this.importAttendanceDialog.isAlreadySubmitted) this.resetFormImportAttendance()
        
        this.importAttendanceDialog.isOpen = false
        window.setTimeout( () => {
            if(this.importAttendanceDialog.isAlreadySubmitted) {
                this.importAttendanceDialog.isAlreadySubmitted = false
                this.importAttendanceDialog.error = []
                this.importAttendanceDialog.importStatus = ''
            }
        }, 100)
    }

    resetFormImportAttendance () : void {
        this.$refs.formImportAttendance.reset()
        this.$refs.formImportAttendance.resetValidation()
    }

    onFormImportSubmitted () : void {
        if(!this.$refs.formImportAttendance.validate()) return

        const { form } = this.importAttendanceDialog
        if(form.file === null) return this.$notifier.showMessage({ content: 'Belum ada file yang dipilih', color: 'error'})
        
        this.importAttendanceDialog.isLoading = true
        AttendanceAPI.importAttendance({ dayOfWork: form.dayOfWork, fileImport : form.file})
        .then( resp => {
            this.resetFormImportAttendance()
            window.setTimeout( () => {
                this.importAttendanceDialog.isAlreadySubmitted = true
            }, 100)

            this.importAttendanceDialog.importStatus = resp.message
            this.importAttendanceDialog.error = resp.error as []
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.importAttendanceDialog.isLoading = false)
    }

    onClickShowBtn (id: string) : void {

    }

    onClickBtnDownloadTemplate () : void {
        this.isBtnDownloadTemplateLoading = true
        AttendanceAPI.downloadTemplateImport().then( (resp) => {
            const url = window.URL.createObjectURL(new Blob([resp.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'templateImportAbsensi.xlsx')
            document.body.appendChild(link)
            link.click()
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isBtnDownloadTemplateLoading = false)
    }

    fetchAttendance () : void {
        this.isLoading = true
        AttendanceAPI.getThisMonth().then( data => {
            this.attendances = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    fetchSavedDayOfWork () : void {
        this.isLoading = true
        AttendanceAPI.getSavedDayOfWork()
        .then( data => {
            this.dayOfWork = data.day_of_work
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)

    }

    mounted () {
        this.fetchAttendance()
        this.fetchSavedDayOfWork()
    }

    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Kelola Gaji Karyawan")
    }
}
</script>

<style lang="scss" scoped>
.CardImportResult{
    overflow-y: auto;
    max-height: 500px;

}
:deep(.v-subheader) {
    height: 20px !important;
}
</style>