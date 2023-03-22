import { Outlet, useNavigate, useParams } from 'react-router'

import { Store } from '@adewaskar/lms-common'
import { useEffect } from 'react'

export default function RootScreen () {
  const { orgId } = useParams()
  console.log('Roor', orgId)
  let userType = window.location.href.includes('learner') ? 'learner' : 'user'
  const { validateUser, setIsSignedin } = Store.useAuthentication(
    state => state
  )
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
        } else {
          return navigate(`/user/${orgId}/login`)
        }
      })
  }, [])

  return (
    <div>
      <Outlet />
    </div>
  )
}
