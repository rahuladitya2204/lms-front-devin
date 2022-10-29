import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import { Fragment, useEffect } from 'react'

import Dashboard from './post-authentication/Dashboard/DashboardScreen'
import HomeScreen from './post-authentication/Home/HomeScreen'
import LoginScreen from './authentication/login/LoginScreen'
import RootScreen from './Root'
import SignupUser from './authentication/signup/SignupUser'
import useAuthentication from '../store/useAuthentication'

function RouteContainer () {
  const { isSignedIn } = useAuthentication(state => state)
  console.log(isSignedIn, 'isSignedIn')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<RootScreen />}>
          {!isSignedIn ? (
            <Fragment>
              <Route path="signup" element={<SignupUser />} />
              <Route path="login" element={<LoginScreen />} />
            </Fragment>
          ) : (
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="home" element={<HomeScreen />} />
            </Route>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default RouteContainer
