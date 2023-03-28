import { Network } from '@adewaskar/lms-common'
import { Utils } from '@adewaskar/lms-common'

Network.Axios.defaults.transformRequest = [
  (data, headers) => {
    const token = getToken()
    if (window.location.pathname.includes('/learner/')) {
      const orgId = Utils.Storage.GetItem('orgId')
      headers.set('x-org', orgId)
    }
    if (token) {
      headers.set('x-auth', token)
    }

    return JSON.stringify(data)
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
