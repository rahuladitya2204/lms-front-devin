import { Course, CourseQuestion, Plan } from '@Types/Courses.types'
import { Learner } from '@Types/Learner.types'

export const INITIAL_COURSE_DETAILS: Course = {
  title: '',
  subtitle: '',
  description: '',
  instructor: '',
  sections: [],
  thumbnailImage: '',
  _id: '',
  studentsEnrolled: 0,
  howToUse: '',
  plan: '',
  whatYouLearn: '',
  requirements: ''
}

export const INITIAL_LEARNER_DETAILS: Learner = {
  email: '',
  name: '',
  recoveryEmail: '',
  username: '',
  contactNo: '',
  isDeactivated: '',
  status: '',
  createdAt: '',
  _id: ''
}

export const INITIAL_COURSE_PLAN_DETAILS: Plan = {
  name: '',
  type: 'one-time',
  finalPrice: {
    value: 0,
    unit: ''
  },
  listPrice: {
    value: 0,
    unit: ''
  },
  _id: '',
  createdAt: '',
  organisation: '',
  course: ''
}

export const INITIAL_QUESTION_DETAILS: CourseQuestion = {
  answers: [],
  title: '',
  course: '',
  upvotes: 0,
  description: '',
  _id: ''
}
