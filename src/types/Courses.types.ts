export interface CourseType {
  title: string;
  _id: string;
  description: string;
}

export interface CreateCoursePayload {
  title: string;
  instructorName: string;
}
