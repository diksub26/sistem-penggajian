import axios from 'axios'
import { Plugin } from '@nuxt/types'

const AxiosDefaultHeader : Plugin = () => {
    axios.defaults.headers["Accept"] = 'application/json'
    axios.defaults.headers["Content-Type"] = 'application/json'
    axios.defaults.baseURL = process.env.API_BASE_URL
}

export default AxiosDefaultHeader