import Axios from '../../../../network'
import { API_ENDPOINTS } from '../../../../network/constants'
import { LoginData, SignupData } from '../../../../types/Common.types'
import { Course, UpdateCoursePayload } from '../../../../types/Courses.types'
import {
  CreateInstructorPayload,
  Instructor
} from '../../../../types/Instructor.types'
import { CreateLearnerPayload, Learner } from '../../../../types/Learner.types'

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

// Course Get, update, delete, create

export const GetCourses = () => {
  return Axios.get(API_ENDPOINTS.user_course).then(r => r.data)
}

export const GetCourseDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.user_course + '/' + id).then(r => r.data)
}
export const CreateCourse = (data: Partial<Course>) => {
  return Axios.post(API_ENDPOINTS.user_course, data).then(r => r.data)
}

export const UpdateCourse = (
  id: string,
  data: Partial<UpdateCoursePayload>
) => {
  return Axios.put(API_ENDPOINTS.user_course + '/' + id, data).then(r => r.data)
}

// Instructor

export const GetInstructors = () => {
  return Axios.get(API_ENDPOINTS.user.instructor).then(d => d.data)
}

export const GetInstructorDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.user.instructor + '/' + id).then(r => r.data)
}
export const CreateInstructor = (data: CreateInstructorPayload) => {
  return Axios.post(API_ENDPOINTS.user.instructor, data)
}

export const UpdateInstructor = (id: string, data: Partial<Instructor>) => {
  return Axios.put(API_ENDPOINTS.user.instructor + '/' + id, data)
}
// Learner

export const GetLearners = () => {
  return Axios.get(API_ENDPOINTS.user.instructor).then(r => r.data)
}

export const GetLearnerDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.user.instructor + '/' + id).then(r => r.data)
}
export const CreateLearner = (data: CreateLearnerPayload) => {
  return Axios.post(API_ENDPOINTS.user.instructor, data).then(r => r.data)
}

export const UpdateLearner = (id: string, data: Partial<Learner>) => {
  return Axios.put(API_ENDPOINTS.user.instructor + '/' + id, data).then(
    r => r.data
  )
}
