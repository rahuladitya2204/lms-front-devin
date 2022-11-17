import { API_ENDPOINTS } from '@Network/constants'
import Axios from '@Network/index'
import { CourseQuestion, CourseQuestionAnswer } from '@Types/Courses.types'

export const GetLearnerCourses = () => {
  return Axios.get(API_ENDPOINTS.learner_course).then(r => r.data)
}

export const GetLearnerCourseDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.learner_course + '/' + id).then(r => r.data)
}

export const GetEnrolledCourseDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.learner_course + '/enrolled/' + id).then(
    r => r.data
  )
}

export const GetCourseQuestions = (courseId: string) => {
  return Axios.get(
    API_ENDPOINTS.learner_course + '/' + courseId + '/question'
  ).then(r => r.data)
}

export const createDiscussionQuestion = (
  courseId: string,
  data: Partial<CourseQuestion>
) => {
  return Axios.post(
    `${API_ENDPOINTS.learner_course}/${courseId}/question`,
    data
  ).then(r => r.data)
}

export const UpdateCourseProgress = (data: {
  courseId: string,
  itemId: string,
  action: string
}) => {
  const body = { itemId: data.itemId, action: data.action }
  return Axios.put(
    `${API_ENDPOINTS.learner_course}/progress/${data.courseId}`,
    body
  ).then(r => r.data)
}

export const createDiscussionQuestionAnswer = (
  courseId: string,
  questionId: string,
  data: Partial<CourseQuestionAnswer>
) => {
  return Axios.post(
    `${API_ENDPOINTS.learner_course}/${courseId}/question/${questionId}/answer`,
    data
  ).then(r => r.data)
}

export const getCoursesOfOrganisation = () => {
  return Axios.get(`${API_ENDPOINTS.learner.self}/organisation/course`).then(
    r => r.data
  )
}

export const enrollForCourse = (courseId: string) => {
  return Axios.post(
    `${API_ENDPOINTS.learner.self}/organisation/course/${courseId}/enroll`
  ).then(r => r.data)
}
