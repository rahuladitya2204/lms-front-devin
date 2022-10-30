import axios from 'axios'
import { config } from '../constants/config'
import { getItemFromStorage } from './storage'

const Axios = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [
    (data, headers) => {
      const token = getItemFromStorage('token')
      // headers.set('Content-Type', 'application/json')
      if (token) {
        headers.set('x-auth', token)
      }
      return JSON.stringify(data)
    }
  ]
})
export default Axios
