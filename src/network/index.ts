import axios from 'axios'
import { config } from '../constants/config'
import { getItemFromStorage } from '@Utils/storage'

const Axios = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [
    (data, headers) => {
      const token =
        getItemFromStorage('user-auth-token') ||
        getItemFromStorage('learner-auth-token')
      const orgId = getItemFromStorage('orgId')
      // headers.set('Content-Type', 'application/json')
      if (token) {
        headers.set('x-auth', token)
      }
      if (orgId) {
        headers.set('x-org', orgId)
      }
      return JSON.stringify(data)
    }
  ],
  // transformResponse: [
  //   (data, headers) => {
  //     console.log(data.data, 'hahaha');
  //     return JSON.parse(data)
  //   }
  // ]
})
export default Axios
