import { LoginData, SignupData } from '../../types/Common.types'

import Axios from '..'

export const LoginLearner = (data: LoginData) => {
  return Axios.post('learner/login', data)
}

export const RegisterLearner = (data: SignupData) => {
  return Axios.post('learner/register', data)
}

export const ValidateLearner = () => {
  return Axios.post('learner/validate')
}
