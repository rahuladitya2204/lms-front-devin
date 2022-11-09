import Axios from '../../../../network'
import { API_ENDPOINTS } from '../../../../network/constants'
import { LoginData, SignupData } from '../../../../types/Common.types'
import { Learner } from '../../../../types/Learner.types'

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

// Get, Update Learner Details

export const GetLearnerDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.learner.self + '/' + id).then(r => r.data)
}

export const UpdateLearner = (id: string, data: Partial<Learner>) => {
  return Axios.put(API_ENDPOINTS.learner.self + '/' + id, data).then(
    r => r.data
  )
}

// Get Courses, Get Detail of courses
export const GetLearnerCourses = () => {
  return Axios.get(API_ENDPOINTS.learner_course).then(r => r.data)
}

export const GetLearnerCourseDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.learner_course + '/' + id).then(r => r.data)
}
