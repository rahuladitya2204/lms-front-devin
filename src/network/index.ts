import { Network, Store } from '@invinciblezealorg/lms-common'

import { Utils } from '@invinciblezealorg/lms-common'

export const getToken = (userType?: string) => {
  if (!userType) {
    userType = Utils.Storage.GetItem('userType')
  }
  const token = Utils.Storage.GetItem(`${userType}-auth-token`)
  return token
}

export const initInterceptors = () => {
  Network.Axios.interceptors.request.use(
    config => {
      config.baseURL = process.env.NEXT_PUBLIC_API_URL;
      // Any status code that lie within the range of 2xx cause this function to trigger
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )


  Network.Axios.defaults.transformRequest = [
    (data, headers) => {
      const orgId = Utils.Storage.GetItem('orgId')
      if (orgId) {
        headers.set('x-org', orgId)
      }
      const orgAlias = Utils.Storage.GetItem('orgAlias')
      const userType = Utils.Storage.GetItem('userType')
      const affiliateId = Utils.Storage.GetItem('affiliateId')
      // console.log()
      const token = getToken(userType)
      if (orgAlias) {
        headers.set('x-org-alias', orgAlias)
      }

      if (affiliateId) {
        headers.set('x-affiliate-id', affiliateId)
      }

      headers.set('x-user-type', userType)

      if (token) {
        headers.set('x-auth', token)
      }
      const customType = headers.get('Content-Type-Custom')
      // console.log(customType, 'customType')
      if (customType) {
        headers.set(`Content-Type`, undefined)
      }
      // console.log(headers, data, 'hshshshsh')
      if (headers.get('x-req-type')) {
        return data
      } else {
        return JSON.stringify(data)
      }
    }
  ]


  Network.Axios.interceptors.response.use(
    response => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response
    },
    error => {
      const setIsSignedIn = Store.useAuthentication.getState().setIsSignedin
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response.status === 401) {
        setIsSignedIn(false)
        // Handle unauthorized access here
        // e.g., Redirect to login, update state, show message, etc.
      }
      return Promise.reject(error)
    }
  )
}