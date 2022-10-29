import { Fragment, useEffect } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import HomeScreen from './post-authentication/Home/HomeScreen'
import LoginScreen from './authentication/login/LoginScreen'
import RootScreen from './Root'
import SignupUser from './authentication/signup/SignupUser'
import useAuthentication from '../store/useAuthentication'

const router = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootScreen />}>
        {!isSignedIn ? (
          <Fragment>
            <Route path="/signup" element={<SignupUser />} />
            <Route path="/login" element={<LoginScreen />} />
          </Fragment>
        ) : (
          <Fragment>
            <Route path="/home" element={<HomeScreen />} />
          </Fragment>
        )}
      </Route>
    )
  )
}

function AppContainer() {
  const { isSignedIn } = useAuthentication(state => state)
  console.log(isSignedIn, 'isSignedIn')
  return <RouterProvider router={router({ isSignedIn })} />
}

export default AppContainer
