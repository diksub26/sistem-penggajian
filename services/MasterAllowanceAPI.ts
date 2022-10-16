import axios from 'axios';

const MS_ALLOWANCE_ENDPOINT = `/master-data/allowance`

export async function get() : Promise<MasterData.Allowance[]> {
    const { data } = await axios.get<System.ApiReponse<MasterData.Allowance[]>>(`${MS_ALLOWANCE_ENDPOINT}`)
    return data.data   
}

export async function getbyUUID(uuid : string) : Promise<MasterData.Allowance> {
    const { data } = await axios.get<System.ApiReponse<MasterData.Allowance>>(`${MS_ALLOWANCE_ENDPOINT}/${uuid}`)

    return data.data   
}

export async function post(payload : { name : string, amount: number}) : Promise<string> {
    const { data } = await axios.post<System.ApiReponse<any>>(`${MS_ALLOWANCE_ENDPOINT}`, payload)

    return data.message   
}

export async function put(uuid :string, payload : { name : string, amount: number}) : Promise<string> {
    const { data } = await axios.put<System.ApiReponse<any>>(`${MS_ALLOWANCE_ENDPOINT}/${uuid}`, payload)

    return data.message   
}

export async function destroy(uuid :string) : Promise<string> {
    const { data } = await axios.delete<System.ApiReponse<any>>(`${MS_ALLOWANCE_ENDPOINT}/${uuid}`)

    return data.message   
}

const MasterAllowanceAPI = {  get, getbyUUID, post, destroy, put }
export default MasterAllowanceAPI