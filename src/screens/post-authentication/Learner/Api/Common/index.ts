import { API_ENDPOINTS } from '@Network/constants'
import Axios from '@Network/index'
import { Course } from '@Types/Courses.types'

export const GetCartItems = () => {
  return Axios.get(API_ENDPOINTS.learner.self + '/cart').then(r => r.data)
}

export const UpdateCartItems = ({
  courseId,
  action
}: {
  courseId: string,
  action: string
}) => {
  return Axios.put(API_ENDPOINTS.learner.self + '/cart', {
    courseId,
    action
  }).then(r => r.data)
}
