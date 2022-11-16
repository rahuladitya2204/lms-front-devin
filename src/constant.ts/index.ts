import { Course, CourseQuestion, Plan } from '@Types/Courses.types'
import { Instructor } from '@Types/Instructor.types'
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
  cartItems:[],
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
  displayPrice: {
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




export const INITIAL_INSTRUCTOR_DETAILS:Instructor = {
  name: '',
  aboutMe: '',
  email: '',
  designation: '',
  image:'',
  createdAt: '',
  updatedAt: '',
  _id: '',
  courses:0,
  organisation:''
  
}