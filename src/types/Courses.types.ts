import { CourseSectionItem, Instructor } from './Common.types'
export interface CourseType {
  title: string;
  _id: string;
  description: string;
}

export interface UpdateCoursePayload {
  title: string;
  howToUse: string;
  courseSections: CourseSectionItem[];
}

export interface CourseDetailType {
  title: string;
  subtitle: string;
  instructor: string;
  description: string;
  howToUse: string;
  courseSections: CourseSectionItem[];
  _id: string;
  whatYouLearn: string[];
  requirements: string[];
}
