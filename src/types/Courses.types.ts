import { ValueUnitType } from './Common.types'

export interface CourseSection {
  items: CourseSectionItem[];
  title: string;
  description: string;
  id: string;
  instructor?: string;
}

export interface CourseSectionItem {
  title: string;
  isPreview?: boolean;
  id: string;
  description?: string;
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
  instructor: string;
  thumbnailImage: string;
  description: string;
  howToUse: string;
  sections: CourseSection[];
  _id: string;
  whatYouLearn: string;
  plan: string;
  requirements: string;
  studentsEnrolled: number;
  questions?: CourseQuestion[];
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
  listPrice: ValueUnitType;
  finalPrice: ValueUnitType;
  _id: string;
}
