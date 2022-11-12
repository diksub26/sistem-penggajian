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

        <v-dialog v-model="salaryInfoDialog.isOpen" max-width="900px" persistent>
            <v-card :loading="salaryInfoDialog.isLoading" :disabled="salaryInfoDialog.isLoading" class="CardSalaryInfo">
                <v-toolbar color="primary" dark dense elevation="0">
                    Informasi Gaji Karyawan
                    <v-spacer />
                    <v-icon size="30" @click="closeSalaryInfoDialog()" title="Tutup">mdi-close</v-icon>
                </v-toolbar>
                <v-card-text class="pt-6">
                    <div>
                        <div class="TextContent">
                            <div class="text-display-1">Periode<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2" v-html="salaryInfoDialog.selectedAttendance.period"></div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Nama Karyawan<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.employeeName }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">No. Induk<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.noInduk }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Divisi<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.division }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Jabatan<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.employeePosition }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Tanggal Aktif<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.assignmentDate }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">No. Rekening<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2 font-weight-bold orange--text">{{ salaryInfoDialog.selectedAttendance.bankAccNo }}</div>
                        </div>
                        <div class="TextContent mt-6">
                            <div class="text-display-1 orange--text">Jumlah Hari Kerja</div>
                            <div class="text-subtitle-2 font-weight-bold orange--text">{{ salaryInfoDialog.selectedAttendance.dayOfWork }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Sakit<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.sick }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Izin<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.permitte }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Cuti<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.leave }}</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1">Terlambat<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ salaryInfoDialog.selectedAttendance.late }}</div>
                        </div>
                    </div>
                    <div>
                        <div class="TextContent mt-md-0 mt-6">
                            <div class="text-display-1 orange--text">Penerimaan</div>
                        </div>
                        <div class="TextContent">
                            <div class="text-display-1 orange--text">Gaji Pokok<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2 orange--text font-weight-bold">{{ formatRupiah(salaryInfoDialog.selectedAttendance.basicSalary) }}</div>
                        </div>
                        <div class="TextContent mt-6">
                            <div class="text-display-1 orange--text">Tunjangan</div>
                        </div>
                        <div class="TextContent" v-for="(allowance, index) in salaryInfoDialog.selectedAttendance.allowances" :key="`${index}_allowance`">
                            <div class="text-display-1">{{ allowance.name}}<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ formatRupiah(allowance.amount) }}</div>
                        </div>
                        <div class="TextContent mt-2 Box">
                            <div class="text-display-1 orange--text">Total Penerimaan Kotor<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2 orange--text font-weight-bold">{{ formatRupiah(salaryInfoDialog.selectedAttendance.total )}}</div>
                        </div>
                        <div class="TextContent mt-6">
                            <div class="text-display-1 orange--text">Potongan</div>
                        </div>
                        <div class="TextContent" v-for="(salaryCut, index) in salaryInfoDialog.selectedAttendance.salaryCuts" :key="`${index}_salaryCut`">
                            <div class="text-display-1">{{ salaryCut.name}}<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">{{ formatRupiah(salaryCut.amount) }}</div>
                        </div>
                        <div class="TextContent mt-2 Box">
                            <div class="text-display-1 orange--text">Total Potongan<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2 orange--text font-weight-bold">{{ formatRupiah(salaryInfoDialog.selectedAttendance.totalSalaryCut )}}</div>
                        </div>
                        <div class="TextContent mt-2 Box">
                            <div class="text-display-1 orange--text">Take Home Pay<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2 orange--text font-weight-bold">{{ formatRupiah(salaryInfoDialog.selectedAttendance.salary )}}</div>
                        </div>
                        <div class="TextContent mt-2" v-if="salaryInfoDialog.selectedAttendance.status !== salaryStatus.Not_Transferred">
                            <div class="text-display-1 orange--text">Status<div class="float-right">:&nbsp;</div></div>
                            <div class="text-subtitle-2">
                                <v-chip :color="getColorForStatus(salaryInfoDialog.selectedAttendance.status)" v-text="salaryInfoDialog.selectedAttendance.status" dark small></v-chip>
                            </div>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions class="pa-4" v-if="salaryInfoDialog.selectedAttendance.status === salaryStatus.Not_Transferred">
                    <v-spacer></v-spacer>
                    <v-btn dark color="green" class="text-none" :loading="salaryInfoDialog.onMarkAsTransferred" depressed @click="markAsTransferred">
                        <v-icon size="20">mdi-bank-transfer</v-icon>&nbsp;Tandai Sudah Transfer
                    </v-btn>
                </v-card-actions>
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
import SalaryAPI from '../../services/SalaryAPI';

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
    salaryStatus = {
        Not_Transferred: SalaryStatus.Not_Transferred
    }

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

    salaryInfoDialog : {
        isOpen : boolean
        isLoading : boolean
        onMarkAsTransferred : boolean
        selectedAttendance : SalaryWithAttendance
    } = {
        isOpen : false,
        isLoading : false,
        onMarkAsTransferred: false,
        selectedAttendance : {
            allowances: [],
            assignmentDate: '',
            bankAccNo: '',
            basicSalary: 0,
            dayOfWork: 0,
            division: '',
            employeeName: '',
            employeePosition: '',
            id: '',
            late: 0,
            leave: 0,
            noInduk: '',
            period: '',
            permitte: 0,
            salaryCuts: [],
            sick: 0,
            status: SalaryStatus.Not_Transferred,
            total: 0,
            salary: 0,
            totalSalaryCut: 0
        }
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

    closeSalaryInfoDialog (isRefreshAttendance = false) :void {
        if(isRefreshAttendance) {
            this.fetchAttendance()
            this.fetchSavedDayOfWork()
        }

        this.salaryInfoDialog.isOpen = false
        this.salaryInfoDialog.selectedAttendance = {
            allowances: [],
            assignmentDate: '',
            bankAccNo: '',
            basicSalary: 0,
            dayOfWork: 0,
            division: '',
            employeeName: '',
            employeePosition: '',
            id: '',
            late: 0,
            leave: 0,
            noInduk: '',
            period: '',
            permitte: 0,
            salaryCuts: [],
            sick: 0,
            status: SalaryStatus.Not_Transferred,
            total: 0,
            salary: 0,
            totalSalaryCut: 0
        }
    }

    onClickShowBtn (id: string) : void {
        this.salaryInfoDialog.isLoading = true
        this.salaryInfoDialog.isOpen = true
        SalaryAPI.getByAttendance(id)
        .then( data => {
            this.salaryInfoDialog.selectedAttendance = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
            this.salaryInfoDialog.isOpen = false
        })
        .finally ( () => this.salaryInfoDialog.isLoading = false)
    }

    markAsTransferred () : void {
        this.salaryInfoDialog.isLoading = true
        this.salaryInfoDialog.onMarkAsTransferred = true
        SalaryAPI.markAsTransferred(this.salaryInfoDialog.selectedAttendance.id)
        .then ( msg => {
            this.closeSalaryInfoDialog(true)
            this.$notifier.showMessage({ content: msg, color: "success"})
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => {
            this.salaryInfoDialog.isLoading = false
            this.salaryInfoDialog.onMarkAsTransferred = false
        })
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
            this.dayOfWork = data.dayOfWork
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
.CardSalaryInfo {
    max-height: 650px;
    :deep(.v-card__text) {
        display: grid;
        grid-template-columns: 1fr 1.1fr;

        @media screen and (max-width: #{map-get($grid-breakpoints, 'md')}) {
            grid-template-columns: 100%;
        }

        .TextContent{
            display: grid;
            grid-template-columns: 0.65fr 1fr;
            line-height: 1.5rem;

            &.Box {
                padding: 4px;
                border: 1px solid #f57c00;
            }
        }
    }
}
</style>