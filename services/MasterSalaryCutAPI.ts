import axios from 'axios';

const MS_SALARY_CUTS_ENDPOINT = `/master-data/salary-cuts`

export async function get() : Promise<MasterData.SalaryCut[]> {
    const { data } = await axios.get<System.ApiReponse<MasterData.SalaryCut[]>>(`${MS_SALARY_CUTS_ENDPOINT}`)
    return data.data   
}

export async function getbyUUID(uuid : string) : Promise<MasterData.SalaryCut> {
    const { data } = await axios.get<System.ApiReponse<MasterData.SalaryCut>>(`${MS_SALARY_CUTS_ENDPOINT}/${uuid}`)

    return data.data   
}

export async function post(payload : { name : string, amount: number}) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<any>>(`${MS_SALARY_CUTS_ENDPOINT}`, payload)

    return data.message   
}

export async function put(uuid :string, payload : { name : string, amount: number}) : Promise<string> {
    const { data } = await axios.put<System.ApiReponse<any>>(`${MS_SALARY_CUTS_ENDPOINT}/${uuid}`, payload)

    return data.message   
}

export async function destroy(uuid :string) : Promise<string> {
    const { data } = await axios.delete<System.ApiReponse<any>>(`${MS_SALARY_CUTS_ENDPOINT}/${uuid}`)

    return data.message   
}

const MasterSalaryCutAPI = {  get, getbyUUID, post, destroy, put }
export default MasterSalaryCutAPI