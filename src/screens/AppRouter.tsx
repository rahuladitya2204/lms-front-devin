import { BrowserRouter, Route, Routes } from 'react-router-dom'

import CourseBuilderScreen from './post-authentication/CourseBuilder/CourseBuilderScreen'
import CoursesScreen from './post-authentication/Courses/CoursesScreen'
import Dashboard from './post-authentication/Dashboard/DashboardScreen'
import { Fragment } from 'react'
import HomeScreen from './post-authentication/Home/HomeScreen'
import LoginScreen from './authentication/login/LoginScreen'
import PDFEditor from './post-authentication/CourseBuilder/UploadItems/UploadPDF/PDFEditor'
import RootScreen from './Root'
import SignupUser from './authentication/signup/SignupUser'
import useAuthentication from '../store/useAuthentication'

function AppRouter () {
  const { isSignedIn } = useAuthentication(state => state)
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
              <Route path="courses" element={<CoursesScreen />} />
              <Route
                path="courses/builder/:id"
                element={<CourseBuilderScreen />}
              >
                <Route
                  path="pdf"
                  element={<PDFEditor />}
                />
              </Route>
            </Route>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
