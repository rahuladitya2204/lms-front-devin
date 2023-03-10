import { Network } from '@adewaskar/lms-common'
import { getItemFromStorage } from '@Utils/storage'

Network.Axios.defaults.transformRequest = [
  (data, headers) => {
    let token
    if (window.location.pathname.includes('/learner/')) {
      token = getItemFromStorage('learner-auth-token')
      const orgId = getItemFromStorage('orgId')
      headers.set('x-org', orgId)
    } else {
      token = getItemFromStorage('user-auth-token')
    }
    // headers.set('Content-Type', 'application/json')
    if (token) {
      headers.set('x-auth', token)
    }
    return JSON.stringify(data)
  }
];
