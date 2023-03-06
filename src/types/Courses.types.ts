import { ValueUnitType } from './Common.types'

export interface CourseSection {
  items: CourseSectionItem[];
  title: string;
  description: string;
  _id: string;
  instructor?: string;
}

export interface CourseSectionItem {
  title: string;
  isPreview?: boolean;
  _id: string;
  description?: string;
  isCompleted?: boolean;
  type: string;
  section?: string;
  metadata?: {
    url?: string,
    duration?: ValueUnitType
  };
}

export interface Course {
  title: string;
  subtitle: string;
  category: CourseCategory;
  instructor: string;
  thumbnailImage: string;
  description: string;
  howToUse: string;
  sections: CourseSection[];
  _id: string;
  whatYouLearn: string;
  plan: string;
  landingPage: CourseLandingPage;
  advanced: CourseAdvancedSetting;
  requirements: string;
  studentsEnrolled: number;
  questions?: CourseQuestion[];
}

export interface EnrolledCourseDetails {
  course: Course;
  progress?: number;
  completed:string[]
}

export interface CourseAdvancedSetting {
  email?: {
    enabled:boolean,
    subject: string;
    content: string;
  }
}

export interface CourseLandingPage {
  url: string;
  promoVideo: string;
  title: string;
  subtitle: string;
}



export interface CourseCategory {
  title: string;
  _id: string;
}

export interface CourseQuestion {
  title: string;
  upvotes: number;
  course: string;
  description: string;
  _id: string;
  answers: CourseQuestionAnswer[];
}

export interface CourseQuestionAnswer {
  user: string;
  answer: string;
}

export interface UpdateCoursePayload extends Partial<Course> {}

export interface CourseCoursePayload extends Partial<Course> {}

export interface Plan {
  name: string;
  organisation: string;
  type: string;
  course: string;
  discount?: number;
  price?: string;
  createdAt: string;
  displayPrice: ValueUnitType;
  finalPrice: ValueUnitType;
  _id: string;
}
