import { Common, Learner, Store, User, Utils } from '@adewaskar/lms-common'
import { useEffect, useMemo, useState } from 'react'

import LoadingScreen from '@Components/LoadingScreen'
import { NotFoundScreen } from './route-list'
import { Outlet } from 'react-router'
import { useAppInit } from '@Hooks/CommonHooks'
import useDynamicFont from '@Hooks/useDynamicFont'

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
  const [font, setFont] = useState({
    name: '',
    url: ''
  })
  const userType = Utils.Storage.GetItem('userType')
  const { isInitDone } = useAppInit(userType, !!isAliasValid)
  const { isLoading } = useDynamicFont({
    fontName: font.name,
    fontUrl: font.url
  })
  useEffect(() => {
    const sd = subdomain + ''
    Learner.Api.ValidateOrgAlias(sd)
      .then(setting => {
        setFont(setting.branding.font)
        setAliasValid(true)
        Utils.Storage.SetItem('orgAlias', sd)
        // fetchOrganisation(userType)
      })

      .catch(() => {
        console.log('invalid')
        setAliasValid(false)
      })
  }, [])
  if (isAliasValid === false) {
    return <NotFoundScreen />
  }
  return isInitDone && isAliasValid ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <LoadingScreen />
  )
}
