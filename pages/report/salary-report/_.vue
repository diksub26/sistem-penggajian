<template>
    <div class="d-contents">
        <v-card class="mb-6" :loading="isLoading" :elevation="0" :disabled="isLoading">
            <v-card-text class="FilterArea">
                <v-btn color="green" dark depressed small class="text-none" @click="onClickPrintBtn()" v-if="reportData.length > 0"><v-icon>mdi-print</v-icon>Print</v-btn>
            </v-card-text>
        </v-card>
        <div v-if="reportData.length > 0" id="printArea" style="width: 100%">
            <div style="text-align:center;font-size: 14pt;font-weight:bold">{{ reportTitle || '-' }}</div>
            <div style="text-align:center;font-size: 12pt;">Periode : {{ reportPeriod || '-' }}</div>
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">Nama Karyawan</th>
                            <th class="text-center">Jabatan</th>
                            <th class="text-center">Gaji Pokok</th>
                            <th class="text-center">Tunjangan</th>
                            <th class="text-center">Potongan</th>
                            <th class="text-center">Total Gaji</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reportData" :key="item.id" >
                            <td>{{ item.employee.fullname  || '-' }}</td>
                            <td>{{ item.employee.position.position_name  || '-'}}</td>
                            <td>{{ formatRupiah(item.salary.basic_salary)  || '-'}}</td>
                            <td class="text-center">{{ formatRupiah(item.salary.total_allowances) }}</td>
                            <td class="text-center">{{ formatRupiah(item.salary.total_salary_cuts) }}</td>
                            <td class="text-center">{{ formatRupiah(item.salary.basic_salary +  item.salary.total_allowances - item.salary.total_salary_cuts) || '-'}}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator'
import ReportAPI from '~/services/Report';
import { formatRupiah } from '~/helper/utilities/NumberFormatter'

@Component({
    layout: "admin",
    head: {
        title: "Laporan Gaji Karyawan"
    },
})
export default class SalaryReportPage extends Vue {
    isLoading : boolean = true
    reportData: any[] = []
    reportTitle: string = ''
    reportPeriod: string = ''
    formatRupiah: (amount: number) => string = formatRupiah

    async fetchReportApi(id:string) : Promise<void> {
        this.isLoading = true
        await ReportAPI.getSalaryReport(id)
        .then( data => {
            this.reportData = data.report
            this.reportTitle = data.title
            this.reportPeriod = data.period
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isLoading = false)
    }

    async mounted() : Promise<void> {
        await this.fetchReportApi(this.$route.params.pathMatch)
        if(this.reportData.length < 1) this.$router.push("/report/salary-report")
    }

    onClickPrintBtn () {
        this.$htmlToPaper('printArea', { specs: [ 
            "fullscreen=yes",
            "titlebar=yes",
            "scrollbars=yes"
        ]})
    }
}
</script>

<style lang="scss" scoped>
.FilterArea{
    display: grid;
    grid-template-columns: auto;
    grid-gap: 12px;
    align-items: center;
    justify-items: start;
}
</style>
