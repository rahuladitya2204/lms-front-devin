import axios from 'axios'
import { config } from '../constants/config'
import { getItemFromStorage } from './storage'

const Axios = axios.create({
  baseURL: config.API_URL,
  transformRequest: [
    (data, headers) => {
      const token = getItemFromStorage('token')
      if (token) {
        headers.set('x-auth', token)
      }
      return data
    }
  ]
})

export default Axios
