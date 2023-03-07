import { CreateInstructorPayload, Instructor } from '@Types/Instructor.types'

import { API_ENDPOINTS } from '@Network/constants'
import Axios from '@Network/index'
import { Organisation } from '@Types/Organisation'
import { User } from '@Types/User.types'

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

