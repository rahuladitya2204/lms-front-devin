import Axios from '@Network/index'
import { API_ENDPOINTS } from '@Network/constants'
import { LoginData, SignupData } from '@Types/Common.types'
import { Learner } from '@Types/Learner.types'

// Login - Register

export const LoginLearner = (data: LoginData) => {
  return Axios.post('learner/login', data)
}

export const RegisterLearner = (data: SignupData) => {
  return Axios.post('learner/register', data)
}

export const ValidateLearner = () => {
  return Axios.post('learner/validate')
}

export const GetLearnerDetails = () => {
  return Axios.get(API_ENDPOINTS.learner.self).then(r => r.data)
}

export const UpdateLearner = (data: Partial<Learner>) => {
  return Axios.put(API_ENDPOINTS.learner.self, data).then(r => r.data)
}
