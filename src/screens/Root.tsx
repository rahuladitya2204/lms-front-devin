import { Outlet, useNavigate } from 'react-router'

import styled from '@emotion/styled'
import useAuthentication from '../store/useAuthentication'
import { useEffect } from 'react'

const Container = styled.div`
  padding: 0;
`

export default function RootScreen () {
  console.log('Hello')
  const { validateUser } = useAuthentication(state => state)
  const navigate = useNavigate()
  useEffect(() => {
    validateUser()
      .then(() => {
        // navigate('user/dashboard/home')
      })
      .catch(() => {
        navigate('login')
      })
  }, [])

  return (
    <Outlet />

  )
}
