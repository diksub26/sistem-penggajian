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
                            <NuxtLink :to="`/report/salary-report/${item.id}`">
                                <v-icon small class='mr-2' color="info" title="Lihat">mdi-file</v-icon>
                            </NuxtLink>
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
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator'
import ReportAPI from '~/services/Report';

@Component({
    layout: "admin",
    head: {
        title: "Laporan Gaji Karyawan"
    },
})
export default class IndexSalaryReport extends Vue {
    isLoading : boolean = true
    reportData: any[] = []

    fetchReportApi() : void {
        this.isLoading = true
        ReportAPI.getSalaryReportAvailiable()
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

    mounted() :void {
        this.fetchReportApi()
    }
}
</script>
