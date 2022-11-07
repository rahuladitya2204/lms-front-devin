import { LoginData, SignupData } from '../../types/Common.types'

import Axios from '..'

export const LoginUser = (data: LoginData) => {
  return Axios.post('user/login', data)
}

export const RegisterUser = (data: SignupData) => {
  return Axios.post('user/register', data)
}

export const ValidateUser = () => {
  return Axios.post('user/validate')
}
