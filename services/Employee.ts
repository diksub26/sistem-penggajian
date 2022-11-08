import axios from 'axios';

const MS_EMPLOYEE_ENDPOINT = `/employee`

export async function get() : Promise<Employee.Data[]> {
    const { data } = await axios.get<System.ApiReponse<Employee.Data[]>>(`${MS_EMPLOYEE_ENDPOINT}`)
    return data.data   
}

export async function getbyUUID(uuid: string) : Promise<Employee.Data> {
    const { data } = await axios.get<System.ApiReponse<Employee.Data>>(`${MS_EMPLOYEE_ENDPOINT}/${uuid}`)
    return data.data   
}

export async function getFullInfo(uuid: string) : Promise<Employee.FullInfo> {
    const { data } = await axios.get<System.ApiReponse<Employee.FullInfo>>(`${MS_EMPLOYEE_ENDPOINT}/full-info/${uuid}`)
    return data.data   
}

export async function post(payload : Employee.Data) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<any>>(`${MS_EMPLOYEE_ENDPOINT}`, payload)

    return data.message   
}

export async function put(uuid :string, payload : Employee.Data) : Promise<string> {
    const { data } = await axios.put<System.ApiReponse<any>>(`${MS_EMPLOYEE_ENDPOINT}/${uuid}`, payload)

    return data.message   
}

export async function destroy(uuid :string) : Promise<string> {
    const { data } = await axios.delete<System.ApiReponse<any>>(`${MS_EMPLOYEE_ENDPOINT}/${uuid}`)

    return data.message   
}

const EmployeeAPI = {  get, getbyUUID, post, destroy, put }
export default EmployeeAPI