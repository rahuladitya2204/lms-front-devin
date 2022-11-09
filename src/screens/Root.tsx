import { Outlet, useNavigate, useParams } from 'react-router'

import useAuthentication from '../store/useAuthentication'
import { useEffect } from 'react'

export default function RootScreen () {
  console.log('Roor')
  const { orgId } = useParams()
  let userType = orgId ? 'learner' : 'user'
  const { validateUser, setIsSignedin } = useAuthentication(state => state)
  const navigate = useNavigate()
  console.log(userType, 'type')
  useEffect(() => {
    validateUser(userType)
      .then(() => {
        setIsSignedin(true)
        console.log(userType, 'user')
        if (userType === 'learner') {
          // return navigate(`/learner/${orgId}/dashboard/home`)
        }
        // navigate(`/user/dashboard/home`)
      })
      .catch(() => {
        // navigate(`/user/login`)
        setIsSignedin(false)
        // if (userType === 'learner') {
        //   navigate(`${userType}/${orgId}/login`)
        // } else {
        //   return navigate(`user/login`)
        // }
      })
  }, [])

  return (
    <div>
      <Outlet />
    </div>
  )
}
