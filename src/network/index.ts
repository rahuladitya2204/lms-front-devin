import { Network } from '@adewaskar/lms-common'
import { Utils } from '@adewaskar/lms-common'

if (process.env.REACT_APP_BUILD_ENV !== 'production') {
  Network.Axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000'
}

Network.Axios.defaults.transformRequest = [
  (data, headers) => {
    const orgId = Utils.Storage.GetItem('orgId')
    if (orgId) {
      headers.set('x-org', orgId)
    }
    const orgAlias = Utils.Storage.GetItem('orgAlias')
    const userType = Utils.Storage.GetItem('userType')
    const token = getToken(userType)
    if (orgAlias) {
      headers.set('x-org-alias', orgAlias)
    }

    headers.set('x-user-type', userType)

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

export const getToken = (userType?: string) => {
  if (!userType) {
    userType = Utils.Storage.GetItem('userType')
  }
  const token = Utils.Storage.GetItem(`${userType}-auth-token`)
  return token
}
