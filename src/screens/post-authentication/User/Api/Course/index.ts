import { Course, Plan, UpdateCoursePayload } from '@Types/Courses.types'

import { API_ENDPOINTS } from '@Network/constants'
import Axios from '@Network/index'

export const GetCourses = () => {
  return Axios.get(API_ENDPOINTS.user_course).then(r => {
    return r.data
  })
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

export const GetCoursePlans = (courseId: string) => {
  return Axios.get(`${API_ENDPOINTS.user.self}/course/${courseId}/plan`).then(
    r => r.data
  )
}

export const CreateCoursePlan = (courseId: string, data: Partial<Plan>) => {
  return Axios.post(
    `${API_ENDPOINTS.user.self}/course/${courseId}/plan`,
    data
  ).then(r => r.data)
}

export const UpdateCoursePlan = (
  courseId: string,
  planId: string,
  data: Partial<Plan>
) => {
  return Axios.put(
    `${API_ENDPOINTS.user.self}/course/${courseId}/plan/${planId}`,
    data
  ).then(r => r.data)
}

export const GetCourseCategories = () => {
  return Axios.get(API_ENDPOINTS.user.courseCategory).then(r => r.data)
}