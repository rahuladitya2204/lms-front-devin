import { LoginData, SignupData } from '../../types'

import axios from 'axios'
import { config } from '../../constants/config'
import { getItemFromStorage } from '../../utils/storage'
import { json } from 'stream/consumers'

const Axios = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [
    (data, headers) => {
      const token = getItemFromStorage('token')
      headers.set('Content-Type', 'application/json')
      if (token) {
        headers.set('x-auth', token)
      }
      return data
    }
  ]
})

export const LoginUser = (data: LoginData) => {
  return Axios.post('users/login', data)
}

export const SignupUser = (data: SignupData) => {
  console.log(data, 'ddd')
  return Axios.post('users/signup', data)
}

export const ValidateUser = () => {
  return Axios.post('/validate')
}
