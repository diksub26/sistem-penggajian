import axios from 'axios';

const REPORT_ENDPOINT = '/report'
export async function getLeaveReportPerMonth (monthYear: string) : Promise<any> {
    const { data } = await axios.get<System.ApiReponse<any>>(`${REPORT_ENDPOINT}/leave/month`, {
        params: { ...{"monthYear" : monthYear} }
    })
    return data.data
}

export async function getOvertimeReportPerMonth (monthYear: string) : Promise<any> {
    const { data } = await axios.get<System.ApiReponse<any>>(`${REPORT_ENDPOINT}/overtime/month`, {
        params: { ...{"monthYear" : monthYear} }
    })
    return data.data
}

export async function getSalaryReportAvailiable () : Promise<any> {
    const { data } = await axios.get<System.ApiReponse<any>>(`${REPORT_ENDPOINT}/salary/avaliable`)
    return data.data
}

export async function getSalaryReport (idImportConfig: string) : Promise<any> {
    const { data } = await axios.get<System.ApiReponse<any>>(`${REPORT_ENDPOINT}/salary/${idImportConfig}`)
    return data.data
}

const ReportAPI = { getLeaveReportPerMonth, getOvertimeReportPerMonth, getSalaryReportAvailiable, getSalaryReport }
export default ReportAPI