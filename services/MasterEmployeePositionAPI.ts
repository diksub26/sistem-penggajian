import axios from 'axios';

const MS_EMPLOYEE_POSITION_ENDPOINT = `/master-data/employe-position`

export async function get() : Promise<MasterData.EmployeePosition[]> {
    const { data } = await axios.get<System.ApiReponse<MasterData.EmployeePosition[]>>(`${MS_EMPLOYEE_POSITION_ENDPOINT}`)
    return data.data   
}

export async function getbyUUID(uuid : string) : Promise<MasterData.EmployeePosition> {
    const { data } = await axios.get<System.ApiReponse<MasterData.EmployeePosition>>(`${MS_EMPLOYEE_POSITION_ENDPOINT}/${uuid}`)

    return data.data   
}

export async function post(payload : { name : string, salary: number}) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<any>>(`${MS_EMPLOYEE_POSITION_ENDPOINT}`, payload)

    return data.message   
}

export async function put(uuid :string, payload : { name : string, salary: number}) : Promise<string> {
    const { data } = await axios.put<System.ApiReponse<any>>(`${MS_EMPLOYEE_POSITION_ENDPOINT}/${uuid}`, payload)

    return data.message   
}

export async function destroy(uuid :string) : Promise<string> {
    const { data } = await axios.delete<System.ApiReponse<any>>(`${MS_EMPLOYEE_POSITION_ENDPOINT}/${uuid}`)

    return data.message   
}

const MasterEmployeePositionAPI = {  get, getbyUUID, post, destroy, put }
export default MasterEmployeePositionAPI