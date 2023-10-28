import { Common, Store, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo } from 'react'

import LoadingScreen from '@Components/LoadingScreen'
import { useAppInit } from '@Hooks/CommonHooks'

export default function RootScreen () {
  const navigate = useNavigate()
  const { isSignedIn } = Store.useAuthentication(s => s)
  let subdomain = useMemo(
    () => {
      const hostname = window.location.hostname
      const parts = hostname.split('.')
      const subdomain = parts.length > 2 ? parts[0] : null
      return subdomain
    },
    [window.location.hostname]
  )
  const userType = Utils.Storage.GetItem('userType')

  // useEffect(
  //   () => {
  //     if (userType === 'user') {
  //       if (isSignedIn && window.location.pathname === '/') {
  //         navigate('app/dashboard')
  //       } else {
  //         // navigate('login')
  //       }
  //     }

  //     if (userType === 'learner' && window.location.pathname === '/') {
  //       navigate('learner/app/store')
  //     }
  //   },
  //   [userType, isSignedIn]
  // )
  // console.log(subdomain, userType, 'user type')
  const { isInitDone } = useAppInit(userType)
  useEffect(() => {
    // console.log(subdomain, 'subdomain')
    Utils.Storage.SetItem('orgAlias', subdomain + '')
  }, [])

  return isInitDone ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <LoadingScreen />
  )
}
