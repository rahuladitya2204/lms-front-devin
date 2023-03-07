import { LoginData, SignupData } from '@Types/Common.types'

import { API_ENDPOINTS } from '@Network/constants'
import Axios from '@Network/index'
import { Organisation } from '@Types/Organisation'

// Login - Register

export const LoginUser = (data: LoginData) => {
  return Axios.post('user/login', data)
}

export const RegisterUser = (data: SignupData) => {
  return Axios.post('user/register', data)
}

export const ValidateUser = (type: string) => {
  return Axios.post(`${type}/validate`)
}

export const UpdateUserAccount = (data: Partial<Organisation>) => {
  return Axios.put(API_ENDPOINTS.user.account, data)
}

export const GetUserAccountDetails = () => {
  return Axios.get(API_ENDPOINTS.user.account).then(r => r.data)
}

export const GetOrganisationDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.user.organisation + '/' + id).then(r => r.data)
}
