import Axios from '@Network/index'
import { API_ENDPOINTS } from '@Network/constants'
import { LoginData, SignupData } from '@Types/Common.types'
import { Learner } from '@Types/Learner.types'
import { CourseQuestion, CourseQuestionAnswer } from '@Types/Courses.types'

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

export const GetLearnerDetails = () => {
  return Axios.get(API_ENDPOINTS.learner.self).then(r => r.data)
}

export const UpdateLearner = (data: Partial<Learner>) => {
  return Axios.put(API_ENDPOINTS.learner.self, data).then(r => r.data)
}

// Get Courses, Get Detail of courses
export const GetLearnerCourses = () => {
  return Axios.get(API_ENDPOINTS.learner_course).then(r => r.data)
}

export const GetLearnerCourseDetails = (id: string) => {
  return Axios.get(API_ENDPOINTS.learner_course + '/' + id).then(r => r.data)
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

export const getInstructors = () => {
  return Axios.get(`${API_ENDPOINTS.learner.self}/instructor`).then(r => r.data)
}
