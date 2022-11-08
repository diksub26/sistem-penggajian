import axios from 'axios';

const OVERTIME_ENDPOINT = `/overtime`

export async function get() : Promise<Overtime[]> {
    const { data } = await axios.get<System.ApiReponse<Overtime[]>>(`${OVERTIME_ENDPOINT}`)
    return data.data   
}

export async function getEmployeOvertime() : Promise<Overtime[]> {
    const { data } = await axios.get<System.ApiReponse<Overtime[]>>(`${OVERTIME_ENDPOINT}/employee`)
    return data.data   
}

export async function post(payload: Overtime) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<string>>(`${OVERTIME_ENDPOINT}`, { ...payload})
    return data.message   
}

export async function updateStatus(uuid: string, status: number) : Promise<string> {
    const { data } = await axios.put<System.ApiReponse<string>>(`${OVERTIME_ENDPOINT}/status/${uuid}`, { status: status })
    return data.message   
}

const OvertimeAPI = {  get, post, getEmployeOvertime, updateStatus }
export default OvertimeAPI