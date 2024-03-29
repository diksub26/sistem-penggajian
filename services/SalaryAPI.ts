import axios from 'axios';

const SALARY_ENDPOINT = '/salary'
export async function getByAttendance (id : string) : Promise<SalaryWithAttendance> {
    const { data } = await axios.get<System.ApiReponse<SalaryWithAttendance>>(`${SALARY_ENDPOINT}/by-attendance/${id}`)

    return data.data
}

export async function markAsTransferred(attendanceId : string) : Promise<string>{
    const { data } = await axios.post<System.ApiReponse<any>>(`${SALARY_ENDPOINT}/mark-as-transferred/${attendanceId}`)

    return data.message
}

export async function slip() : Promise<any>{
    const { data } = await axios.get<System.ApiReponse<any>>(`${SALARY_ENDPOINT}/slip`)
    return data.data
}

const SalaryAPI = { getByAttendance, markAsTransferred, slip }
export default SalaryAPI