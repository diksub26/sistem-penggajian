<template>
    <div class="d-contents">
        <v-card class="mb-6" :loading="isLoading" :elevation="0" :disabled="isLoading">
            <v-card-text class="FilterArea">
                <v-text-field label="Pilih Bulan" type="month" v-model="monthYear" style="width: 100%"/>
                <div>
                    <v-btn color="blue" dark depressed small class="text-none" @click="fetchReportApi()"><v-icon>mdi-search</v-icon>Cari Data</v-btn>
                    <v-btn color="green" dark depressed small class="text-none" @click="onClickPrintBtn()" v-if="reportData.length > 0"><v-icon>mdi-print</v-icon>Print</v-btn>
                </div>
            </v-card-text>
        </v-card>
        <div v-if="reportData.length > 0" id="printArea" style="width: 100%">
            <div style="text-align:center;font-size: 14pt;font-weight:bold">Laporan Cuti Karyawan Bulan {{ monthSpelling || '-' }}</div>
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">Nama Karyawan</th>
                            <th class="text-center">Nama Manajer</th>
                            <th class="text-center">Alasan</th>
                            <th class="text-center">Tipe</th>
                            <th class="text-center">Tgl Mulai</th>
                            <th class="text-center">Tgl Akhir</th>
                            <th class="text-center">Jumlah</th>
                            <th class="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reportData" :key="item.id" >
                            <td>{{ item.employeeName }}</td>
                            <td>{{ item.managerName }}</td>
                            <td>{{ item.reason }}</td>
                            <td class="text-center">{{ item.type }}</td>
                            <td class="text-center">{{ item.startDate }}</td>
                            <td class="text-center">{{ item.endDate }}</td>
                            <td class="text-center">{{ item.amount }}</td>
                            <td class="text-center">{{ item.status }}</td>
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

@Component({
    layout: "admin",
    head: {
        title: "Laporan Cuti Karyawan"
    },
})
export default class LeaveReportPage extends Vue {
    isLoading : boolean = true
    monthYear: string = ''
    reportData: any[] = []
    monthSpelling: string = ''

    fetchReportApi() : void {
        this.isLoading = true
        ReportAPI.getLeaveReportPerMonth(this.monthYear)
        .then( data => {
            this.reportData = data.report
            this.monthSpelling = data.month
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isLoading = false)
    }

    mounted() :void {
        let _now : Date | string = new Date()
        _now = _now.toISOString().split('T')[0]
        this.monthYear = _now.substring(0, _now.length - 3)
        this.fetchReportApi()
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
    grid-template-columns: 200px auto;
    grid-gap: 12px;
    align-items: center;
    justify-items: start;
}
</style>
