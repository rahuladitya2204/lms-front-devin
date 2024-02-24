// @ts-ignore
import { Outlet } from 'react-router'
import { useAppInit } from '@Hooks/CommonHooks'

export default function RootScreen () {
  const { isInitDone } = useAppInit()
  const showLoadingScreen = !isInitDone
  return <Outlet context={{ showLoadingScreen }} />
}
