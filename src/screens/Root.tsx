import { Outlet, useLocation, useNavigate } from 'react-router'

import styled from '@emotion/styled'
import useAuthentication from '../store/useAuthentication'
import { useEffect } from 'react'

export default function RootScreen () {
  const { validateUser } = useAuthentication(state => state)
  const location = useLocation()
  const navigate = useNavigate()
  console.log(location.pathname, 'path')
  useEffect(() => {
    validateUser()
      .then(() => {
        // navigate('user/dashboard/home')
      })
      .catch(() => {
        navigate('user/login')
      })
  }, [])

  return <Outlet />
}
