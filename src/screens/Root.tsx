import { Outlet, useParams } from 'react-router'

import LoadingScreen from '@Components/LoadingScreen'
import { useAppInit } from '@Hooks/CommonHooks'

export default function RootScreen () {
  let userType = window.location.href.includes('learner') ? 'learner' : 'user'
  const { isInitDone } = useAppInit(userType)

  return isInitDone ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <LoadingScreen />
  )
}
