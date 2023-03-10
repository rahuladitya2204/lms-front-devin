import { Network } from '@adewaskar/lms-common';
import { Utils } from '@adewaskar/lms-common'

Network.Axios.defaults.transformRequest = [
  (data, headers) => {
    let token
    if (window.location.pathname.includes('/learner/')) {
      token = Utils.Storage.GetItem('learner-auth-token')
      const orgId = Utils.Storage.GetItem('orgId')
      headers.set('x-org', orgId)
    } else {
      token = Utils.Storage.GetItem('user-auth-token')
    }
    if (token) {
      headers.set('x-auth', token)
    }
    return JSON.stringify(data)
  }
];

