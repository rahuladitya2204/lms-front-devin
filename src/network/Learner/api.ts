import { LoginData, SignupData } from '../../types/Common.types'

import Axios from '..'
import { CreateLearnerPayload, Learner } from '../../types/Learner.types'

const PREFIX = 'user/learner'

export const LoginLearner = (data: LoginData) => {
  return Axios.post('learner/login', data)
}

export const RegisterLearner = (data: SignupData) => {
  return Axios.post('learner/register', data)
}

export const ValidateLearner = () => {
  return Axios.post('learner/validate')
}

export const GetLearners = () => {
  return Axios.get(PREFIX).then(r => r.data)
}

export const GetLearnerDetails = (id: string) => {
  return Axios.get(PREFIX + '/' + id).then(r => r.data)
}
export const CreateLearner = (data: CreateLearnerPayload) => {
  return Axios.post(PREFIX, data).then(r => r.data)
}

export const UpdateLearner = (id: string, data: Partial<Learner>) => {
  return Axios.put(PREFIX + '/' + id, data).then(r => r.data)
}
