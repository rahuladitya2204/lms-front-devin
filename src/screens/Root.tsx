import { Common, Learner, Store, User, Utils } from '@adewaskar/lms-common'
import { useEffect, useMemo, useState } from 'react'

import LoadingScreen from '@Components/LoadingScreen'
import { NotFoundScreen } from './route-list'
import { Outlet } from 'react-router'
import { useAppInit } from '@Hooks/CommonHooks'
import useDynamicFont from '@Hooks/useDynamicFont'

export default function RootScreen () {
  const userType = Utils.Storage.GetItem('userType')
  const { isInitDone, isAliasValid } = useAppInit(userType)
  const showLoadingScreen = !(isInitDone && isAliasValid)
  return <Outlet context={{ showLoadingScreen }} />
}
