export interface InstructorType {
  aboutMe: string;
  name: string;
  organisation: string;
  designation: string;
  email: string;
  image: string;
  createdAt: string;
  courses: number;
  updatedAt: string;

}

export interface CreateInstructorPayload extends InstructorType {

}

export interface InstructorDetailsType extends InstructorType {
  _id: string;
  rating?: string;
}
