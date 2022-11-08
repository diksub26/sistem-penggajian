import axios from 'axios';

const EMPLOYEE_ENDPOINT = `/employee`

export async function get(employeUUID : string) : Promise<MasterData.Allowance[]> {
    const { data } = await axios.get<System.ApiReponse<MasterData.Allowance[]>>(`${EMPLOYEE_ENDPOINT}/get-allowance/${employeUUID}`)
    return data.data   
}

export async function add(employeUUID : string, msAllowanceId : string) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<any>>(`${EMPLOYEE_ENDPOINT}/add-allowance/${employeUUID}`, {
        msAllowanceId: msAllowanceId
    })
    return data.message   
}

export async function destroy(uuid :string) : Promise<string> {
    const { data } = await axios.delete<System.ApiReponse<any>>(`${EMPLOYEE_ENDPOINT}/delete-allowance/${uuid}`)

    return data.message   
}

const EmployeeAllowanceAPI = {  get, add, destroy }
export default EmployeeAllowanceAPI