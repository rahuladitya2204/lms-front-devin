import { CourseSectionItem, Instructor } from './Common.types'

export interface Course {
  title: string;
  subtitle: string;
  instructor: string;
  thumbnailImage: string;
  description: string;
  howToUse: string;
  courseSections: CourseSectionItem[];
  _id: string;
  whatYouLearn: string[];
  requirements: string[];
}


export interface UpdateCoursePayload extends Partial<Course> {

}


export interface CourseCoursePayload extends Partial<Course> {

}