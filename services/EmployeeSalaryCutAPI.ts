import axios from 'axios';

const EMPLOYEE_ENDPOINT = `/employee`

export async function get(employeUUID : string) : Promise<MasterData.SalaryCut[]> {
    const { data } = await axios.get<System.ApiReponse<MasterData.SalaryCut[]>>(`${EMPLOYEE_ENDPOINT}/get-salary-cut/${employeUUID}`)
    return data.data   
}

export async function add(employeUUID : string, msSalaryCutId : string) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<any>>(`${EMPLOYEE_ENDPOINT}/add-salary-cut/${employeUUID}`, {
        msSalaryCutId: msSalaryCutId
    })
    return data.message   
}

export async function destroy(uuid :string) : Promise<string> {
    const { data } = await axios.delete<System.ApiReponse<any>>(`${EMPLOYEE_ENDPOINT}/delete-salary-cut/${uuid}`)

    return data.message   
}

const EmployeeSalaryCutAPI = {  get, add, destroy }
export default EmployeeSalaryCutAPI