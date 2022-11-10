import { Outlet, useNavigate, useParams } from 'react-router'

import useAuthentication from '@Store/useAuthentication'
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
        // if (userType === 'learner') {
        //   return navigate(`/learner/${orgId}/dashboard/courses`)
        // }
        // navigate(`/user/dashboard/courses`)
      })
      .catch(() => {
        console.log('not signedin')
        // navigate(`/user/login`)
        setIsSignedin(false)
        if (userType === 'learner') {
          return navigate(`/learner/${orgId}/login`)
        }
        navigate(`/user/login`)
      })
  }, [])

  return (
    <div>
      <Outlet />
    </div>
  )
}
