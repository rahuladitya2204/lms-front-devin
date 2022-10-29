import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import { Fragment, useEffect } from 'react'

import HomeScreen from './post-authentication/Home/HomeScreen'
import LoginScreen from './authentication/login/LoginScreen'
import RootScreen from './Root'
import SignupUser from './authentication/signup/SignupUser'
import useAuthentication from '../store/useAuthentication'

function AppContainer () {
  const { isSignedIn } = useAuthentication(state => state)
  console.log(isSignedIn, 'isSignedIn')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<RootScreen />}>
          {!isSignedIn ? (
            <Fragment>
              <Route path="signup" element={<SignupUser />} />
              <Route path="login" element={<LoginScreen />} />
            </Fragment>
          ) : (
            <Route path="home" element={<HomeScreen />} />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppContainer
