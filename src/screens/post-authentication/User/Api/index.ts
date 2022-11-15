import Axios from '@Network/index'
import { LoginData, SignupData } from '@Types/Common.types'

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

