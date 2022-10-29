import { Outlet, useNavigate } from 'react-router'

import useAuthentication from '../store/useAuthentication'
import { useEffect } from 'react'

export default function RootScreen () {
  const { validateUser } = useAuthentication(state => state)
  const navigate = useNavigate()
  useEffect(() => {
    validateUser().then(() => {
      navigate('/home')
    }).catch(() => {
      navigate('/login')
    })
  }, [])

  return <Outlet />
}
