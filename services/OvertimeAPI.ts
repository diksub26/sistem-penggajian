import axios from 'axios';

const OVERTIME_ENDPOINT = `/overtime`

export async function get() : Promise<Overtime[]> {
    const { data } = await axios.get<System.ApiReponse<Overtime[]>>(`${OVERTIME_ENDPOINT}`)
    return data.data   
}

export async function post(payload: Overtime) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<string>>(`${OVERTIME_ENDPOINT}`, { ...payload})
    return data.message   
}

const OvertimeAPI = {  get, post }
export default OvertimeAPI