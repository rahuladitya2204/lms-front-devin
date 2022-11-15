import { API_ENDPOINTS } from "@Network/constants"
import Axios from "@Network/index"

export const getInstructors = () => {
    return Axios.get(`${API_ENDPOINTS.learner.self}/instructor`).then(r => r.data)
  }
  