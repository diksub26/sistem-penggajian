import axios from 'axios';

const AUTH_ENDPOINT = `/auth`

export async function login(payload : { email: string, password: string}) : Promise<System.AuthData> {
    const { data } = await axios.post<System.ApiReponse<System.AuthData>>(`${AUTH_ENDPOINT}/login`, payload)
    return data.data   
}

export async function logout () : Promise<string> {
    const { data } = await axios.get<System.ApiReponse<any>>(`${AUTH_ENDPOINT}/logout`)

    return data.message
}

export async function me() : Promise<System.AuthData> {
    const { data } = await axios.get<System.ApiReponse<System.AuthData>>(`${AUTH_ENDPOINT}/me`)
    return data.data   
}

const AuthAPI = {  login, logout, me }
export default AuthAPI