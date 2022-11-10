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
      let token
      if (window.location.pathname.includes('/learner/')) {
        token = getItemFromStorage('learner-auth-token')
        const orgId = getItemFromStorage('orgId')
        headers.set('x-org', orgId)
      } else {
        token = getItemFromStorage('user-auth-token')
      }
      // headers.set('Content-Type', 'application/json')
      if (token) {
        headers.set('x-auth', token)
      }
      return JSON.stringify(data)
    }
  ]
  // transformResponse: [
  //   (data, headers) => {
  //     console.log(data.data, 'hahaha');
  //     return JSON.parse(data)
  //   }
  // ]
})
export default Axios
