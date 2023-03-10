import { Types } from '@adewaskar/lms-common'

export const INITIAL_COURSE_DETAILS: Types.Course = {
  title: '',
  subtitle: '',
  description: '',
  category: {
    title: '',
    _id: ''
  },
  instructor: '',
  sections: [],
  thumbnailImage: '',
  _id: '',
  landingPage: {
    url: '',
    promoVideo: '',
    title: '',
    subtitle: ''
  },
  advanced: {
    email: {
      content: '',
      enabled: false,
      subject: ''
    }
  },
  studentsEnrolled: 0,
  howToUse: '',
  plan: '',
  whatYouLearn: '',
  requirements: ''
}

export const INITIAL_ENROLLED_COURSE_DETAILS = {
  course: INITIAL_COURSE_DETAILS,
  completed: [],
  progress: 0
}

export const INITIAL_LEARNER_DETAILS: Types.Learner = {
  email: '',
  name: '',
  recoveryEmail: '',
  username: '',
  contactNo: '',
  isDeactivated: '',
  cartItems: [],
  status: '',
  createdAt: '',
  _id: ''
}

export const INITIAL_COURSE_PLAN_DETAILS: Types.Plan = {
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

export const INITIAL_QUESTION_DETAILS: Types.CourseQuestion = {
  answers: [],
  title: '',
  course: '',
  upvotes: 0,
  description: '',
  _id: ''
}

export const INITIAL_INSTRUCTOR_DETAILS: Types.Instructor = {
  name: '',
  aboutMe: '',
  email: '',
  designation: '',
  image: '',
  createdAt: '',
  updatedAt: '',
  _id: '',
  courses: 0,
  organisation: ''
}

export const INITIAL_USER_DETAILS: Types.User = {
  email: '',
  name: '',
  recoveryEmail: '',
  username: '',
  contactNo: '',
  isDeactivated: '',
  status: '',
  _id: ''
}

export const INITIAL_ORG_DETAILS: Types.Organisation = {
  name: '',
  email: '',
  website: '',
  _id: '',
  users: [],
  contactNo: '',
  logo: '',
  learners: []
}
