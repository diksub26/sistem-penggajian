import axios from 'axios';

const LEAVE_ENDPOINT = `/leave`

export async function get() : Promise<Leave[]> {
    const { data } = await axios.get<System.ApiReponse<Leave[]>>(`${LEAVE_ENDPOINT}`)
    return data.data   
}

export async function post(payload: Leave) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<string>>(`${LEAVE_ENDPOINT}`, { ...payload})
    return data.message   
}

export async function updateStatus(uuid: string, status: number) : Promise<string> {
    const { data } = await axios.put<System.ApiReponse<string>>(`${LEAVE_ENDPOINT}/status/${uuid}`, { status: status })
    return data.message   
}

export async function getEmployeLeave() : Promise<Leave[]> {
    const { data } = await axios.get<System.ApiReponse<Leave[]>>(`${LEAVE_ENDPOINT}/employee`)
    return data.data   
}

const LeaveAPI = {  get, post, updateStatus, getEmployeLeave }
export default LeaveAPI