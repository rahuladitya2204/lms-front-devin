import { Common, Learner, Store, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo, useState } from 'react'

import LoadingScreen from '@Components/LoadingScreen'
import MaintainenceScreen from './MaintainenceScreen/MaintainenceScreen'
import { NotFoundScreen } from './route-list'
import { useAppInit } from '@Hooks/CommonHooks'

export default function RootScreen () {
  const [isAliasValid, setAliasValid] = useState<boolean | null>(null)
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
  const { isInitDone } = useAppInit(userType,!!isAliasValid)
  useEffect(() => {
    const sd = subdomain + ''
    Learner.Api.ValidateOrgAlias(sd)
      .then(() => {
        Utils.Storage.SetItem('orgAlias', sd)
        setAliasValid(true)
      })
      .catch(() => {
        console.log('invalid')
        setAliasValid(false)
      })
    // console.log(sd, 'sd')
  }, [])
  if (isAliasValid === false) {
    return <NotFoundScreen />
  }
  return (isInitDone&&isAliasValid) ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <LoadingScreen />
  )
}
