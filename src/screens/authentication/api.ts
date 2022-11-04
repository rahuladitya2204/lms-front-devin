import { LoginData, SignupData } from '../../types/Common.types'

import Axios from '../../utils/network'

export const LoginUser = (data: LoginData) => {
  return Axios.post('auth/login', data)
}

export const SignupUser = (data: SignupData) => {
  return Axios.post('auth/signup', data)
}

export const ValidateUser = () => {
  return Axios.post('auth/validate')
}
