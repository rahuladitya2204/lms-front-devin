export interface Instructor {
  aboutMe: string;
  name: string;
  organisation: string;
  designation: string;
  email: string;
  image: string;
  createdAt: string;
  courses: number;
  updatedAt: string;
  _id: string;
  rating?: string;
}

export interface CreateInstructorPayload extends Partial<Instructor> {

}

export interface InstructorDetailsType extends Partial<Instructor> {

}
