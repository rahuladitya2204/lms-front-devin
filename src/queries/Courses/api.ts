import {
  CreateCoursePayload,
  UpdateCoursePayload
} from '../../types/Courses.types'

import Axios from '../../utils/network'

export const GetCourses = () => {
  return Axios.get('courses').then(r => r.data)
}

export const GetCourseDetails = (id: string) => {
  return Axios.get('courses/' + id).then(r => r.data)
}
export const CreateCourse = (data: CreateCoursePayload) => {
  return Axios.post('courses', data).then(r => r.data)
}

export const UpdateCourse = (id: string, data: Partial<UpdateCoursePayload>) => {
  return Axios.put('courses/' + id, data).then(r => r.data)
}
