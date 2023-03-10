import { API_ENDPOINTS } from '@Network/constants'
import Axios from '@Network/index'
import { Types } from '@adewaskar/lms-common'

// Login - Register

export const LoginLearner = (data: Types.LoginData) => {
  return Axios.post('learner/login', data)
}

export const RegisterLearner = (data: Types.SignupData) => {
  return Axios.post('learner/register', data)
}

export const ValidateLearner = () => {
  return Axios.post('learner/validate')
}

export const GetLearnerDetails = () => {
  return Axios.get(API_ENDPOINTS.learner.self).then(r => r.data)
}

export const UpdateLearner = (data: Partial<Types.Learner>) => {
  return Axios.put(API_ENDPOINTS.learner.self, data).then(r => r.data)
}
