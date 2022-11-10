import { ValueUnitType } from "./Common.types";

export interface CourseSection {
  items: CourseSectionItem[];
  title: string;
  description: string;
  id: string;
  instructor?: string;
}

export interface CourseSectionItem {
  title: string;
  id: string;
  description?: string;
  // url?: string;
  type: string;
  metadata?: {
    url?: string;
    duration?: ValueUnitType;
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
  whatYouLearn: string[];
  requirements: string[];
}

export interface UpdateCoursePayload extends Partial<Course> {}

export interface CourseCoursePayload extends Partial<Course> {}
