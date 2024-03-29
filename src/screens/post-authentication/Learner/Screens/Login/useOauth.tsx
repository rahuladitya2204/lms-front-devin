import useServerAuth from '@ServerHooks/useServerAuth'
import { Store, User, Utils } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

const useLearnerOauth = (provider: string) => {
  const [loading, setLoading] = useState(false)
  const { data: googleLoginUrl } = User.Queries.useGetProviderLoginUrl(provider)
  const setIsSignedin = useServerAuth(state => state.setIsSignedIn)
  useEffect(() => {
    window.addEventListener(
      'message',
      function(e) {
        if (e.data.type === 'oauth-completed') {
          console.log(e.data, 'token')
          const token = e.data.data.token
          Utils.Storage.SetItem('learner-auth-token', token)
          setIsSignedin(true)
          setLoading(false)
        }
      },
      false
    )
  }, [])

  const openWindow = () => {
    setLoading(true)
    window.open(googleLoginUrl)
  }

  return {
      openWindow,
      loading
  }
}

export default useLearnerOauth
