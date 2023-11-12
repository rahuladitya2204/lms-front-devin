import { Common, Learner, Store, User, Utils } from '@adewaskar/lms-common'
import { useEffect, useMemo, useState } from 'react'

import LoadingScreen from '@Components/LoadingScreen'
import { NotFoundScreen } from './route-list'
import { Outlet } from 'react-router'
import { useAppInit } from '@Hooks/CommonHooks'
import useDynamicFont from '@Hooks/useDynamicFont'

export default function RootScreen () {
  const { isInitDone } = useAppInit()
  const showLoadingScreen = !isInitDone
  return <Outlet context={{ showLoadingScreen }} />
}
