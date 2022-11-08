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

const LeaveAPI = {  get, post }
export default LeaveAPI