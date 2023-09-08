import { Common, Utils } from '@adewaskar/lms-common'
import { Outlet, useParams } from 'react-router'

import LoadingScreen from '@Components/LoadingScreen'
import { useAppInit } from '@Hooks/CommonHooks'
import { useEffect } from 'react'

export default function RootScreen () {
  let userType = window.location.href.includes('learner') ? 'learner' : 'user'
  const { isInitDone } = useAppInit(userType)
  // const { data: config } = Common.Queries.useGetAppConfig(userType)
  // const orgId = Utils.Storage.GetItem('orgId');
  // useEffect(
  //   () => {
  //     if (orgId) {
  //       Utils.Storage.SetItem('orgId', orgId + '')
  //     }
  //   },
  //   [orgId]
  // )
  useEffect(() => {
    const hostname = window.location.hostname
    const parts = hostname.split('.')
    const subdomain = parts.length > 2 ? parts[0] : null
    console.log(subdomain, 'subdomain')
    Utils.Storage.SetItem('orgAlias', subdomain + '');
  }, [])

  return isInitDone ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <LoadingScreen />
  )
}
