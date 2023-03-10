import { API_ENDPOINTS } from "@Network/constants"
import Axios from "@Network/index"
import { Types } from '@adewaskar/lms-common'

export const GetLearners = () => {
    return Axios.get(API_ENDPOINTS.user.instructor).then(r => r.data)
  }
  
  export const GetLearnerDetails = (id: string) => {
    return Axios.get(API_ENDPOINTS.user.instructor + '/' + id).then(r => r.data)
  }
  export const CreateLearner = (data: Types.CreateLearnerPayload) => {
    return Axios.post(API_ENDPOINTS.user.instructor, data).then(r => r.data)
  }
  
  export const UpdateLearner = (id: string, data: Partial<Types.Learner>) => {
    return Axios.put(API_ENDPOINTS.user.instructor + '/' + id, data).then(
      r => r.data
    )
  }
  