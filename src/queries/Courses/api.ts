import Axios from '../../utils/network'
import { CreateCoursePayload } from '../../types/Courses.types'

export const GetCourses = () => {
  return Axios.get('courses').then(r => r.data)
}

export const GetCourseDetails = (id: string) => {
  return Axios.get('courses/' + id).then(r => r.data)
}
export const CreateCourse = (data: CreateCoursePayload) => {
  return Axios.post('courses', data).then(r => r.data)
}
