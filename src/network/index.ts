import { Network } from '@adewaskar/lms-common'
import { Utils } from '@adewaskar/lms-common'

// if (process.env.REACT_APP_BUILD_ENV !== 'production') {
  Network.Axios.defaults.baseURL = `http://localhost:4000`
// }

Network.Axios.defaults.transformRequest = [
  (data, headers) => {
    const token = getToken()
    const orgId = Utils.Storage.GetItem('orgId')
    headers.set('x-org', orgId)
    if (window.location.pathname.includes('/learner/')) {
      headers.set('x-user-type', 'learner')
    } else {
      headers.set('x-user-type', 'user')
    }
    if (token) {
      headers.set('x-auth', token)
    }
    if (headers.get('x-req-type')) {
      return data
    } else {
      return JSON.stringify(data)
    }
  }
]

export const getToken = () => {
  let token
  if (window.location.pathname.includes('/learner/')) {
    token = Utils.Storage.GetItem('learner-auth-token')
  } else {
    token = Utils.Storage.GetItem('user-auth-token')
  }
  return token
}
