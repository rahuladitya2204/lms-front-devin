import {
  CreateInstructorPayload,
  InstructorDetailsType
} from '../../types/Instructor.types'

import Axios from '../../utils/network'

const PREFIX = 'instructor'

export const GetInstructors = () => {
  return Axios.get(PREFIX).then(r => r.data)
}

export const GetInstructorDetails = (id: string) => {
  return Axios.get(PREFIX + '/' + id).then(r => r.data)
}
export const CreateInstructor = (data: CreateInstructorPayload) => {
  return Axios.post(PREFIX, data).then(r => r.data)
}

export const UpdateInstructor = (
  id: string,
  data: Partial<InstructorDetailsType>
) => {
  return Axios.put(PREFIX + '/' + id, data).then(r => r.data)
}
