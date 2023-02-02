<template>
    <div class="d-contents">
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-center">Bulan</th>
                        <th class="text-center">Tahun</th>
                        <th class="text-center">Jumlah Hari Kerja</th>
                        <th class="text-center">Periode</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody v-if="reportData.length > 0">
                    <tr v-for="item in reportData" :key="item.id">
                        <td>{{ item.month }}</td>
                        <td>{{ item.year }}</td>
                        <td>{{ item.dayOfWork }}</td>
                        <td class="text-center">{{ item.startPeriod }}&nbsp;-&nbsp;{{ item.endPeriod }}</td>
                        <td>
                            <v-icon small class='mr-2' @click="onClickShowBtn(item.id)" color="info" title="Detail">mdi-eye</v-icon>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td class="text-center" colspan="6">Data Tidak Tersedia.</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
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
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator'
import SalaryStatus from '~/helper/enum/SalaryStatus';
import SystemStateHelper from '~/helper/store/SystemState';
import { formatRupiah } from '~/helper/utilities/NumberFormatter';
import SalaryAPI from '~/services/SalaryAPI';

@Component({
    layout: "admin",
    head: {
        title: "Lihat Slip Gaji"
    },
})
export default class SalarySlipPage extends Vue {
    isLoading : boolean = true
    reportData: any[] = []
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
    formatRupiah: (amount: number) => string = formatRupiah
    
    fetchReportApi() : void {
        this.isLoading = true
        SalaryAPI.slip()
        .then( data => {
            this.reportData = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isLoading = false)
    }

    closeSalaryInfoDialog () :void {
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

    mounted() :void {
        this.fetchReportApi()
    }

    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Lihat Slip Gaji")
    }
}
</script>

<style lang="scss" scoped>
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
</style>
