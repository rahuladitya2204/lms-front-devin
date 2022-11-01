import { DataNode } from "antd/lib/tree";

export interface CourseType {
  title: string;
  _id: string;
  description: string;
}

export interface CreateCoursePayload {
  title: string;
  instructorName: string;
}


export interface UpdateCoursePayload {
  title: string;
  instructorName: string;
  howToUse: string;
  courseTree: DataNode[];
}

export interface CourseDetailsType{
  title: string;
  instructorName: string;
  howToUse: string;
  courseTree: DataNode[];
  _id: string;
}
