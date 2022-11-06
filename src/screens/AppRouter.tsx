import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AddTextItem from './post-authentication/Admin/CourseBuilder/UploadItems/AddTextItem/AddTextItem'
import CourseBuilderScreen from './post-authentication/Admin/CourseBuilder/CourseBuilderScreen'
import CourseDetailsEditor from './post-authentication/Admin/CourseBuilderDetails'
import CourseEditor from './post-authentication/Admin/CourseEditor'
import CourseItemViewer from './post-authentication/User/CourseViewer/CourseItemViewer'
import CourseViewer from './post-authentication/User/CourseViewer/CourseViewer'
import CoursesScreen from './post-authentication/Admin/Courses/CoursesScreen'
import Dashboard from './post-authentication/Common/Dashboard/DashboardScreen'
import { Fragment } from 'react'
import HomeScreen from './post-authentication/Admin/Home/HomeScreen'
import LoginScreen from './authentication/login/LoginScreen'
import RootScreen from './Root'
import SignupUser from './authentication/signup/SignupUser'
import UploadFileForm from './post-authentication/Admin/CourseBuilder/UploadItems/UploadFile/UploadFileForm'
import UploadPDFForm from './post-authentication/Admin/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from './post-authentication/Admin/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import useAuthentication from '../store/useAuthentication'

function AppRouter () {
  const { isSignedIn } = useAuthentication(state => state)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootScreen />}>
          {!isSignedIn ? (
            <Fragment>
              <Route path="signup" element={<SignupUser />} />
              <Route path="login" element={<LoginScreen />} />
            </Fragment>
          ) : (
              <>
              <Route path='admin'>
              <Route path="dashboard" element={<Dashboard />}>
              <Route path="home" element={<HomeScreen />} />
              <Route path="courses" element={<CoursesScreen />} />
              <Route path="courses" element={<CoursesScreen />} />
              <Route
                path="courses/builder/:id"
                element={<CourseBuilderScreen />}
              >
                <Route path="pdf/:nodeId" element={<UploadPDFForm />} />
                <Route path="video/:nodeId" element={<UploadVideoForm />} />
                <Route path="text/:nodeId" element={<AddTextItem />} />
                <Route path="file/:nodeId" element={<UploadFileForm />} />
              </Route>
                    <Route path="courses/editor/:id" element={<CourseEditor />} >
                    {/* <Route path="details" element={<CourseDetailsEditor />} ></Route> */}

              </Route>
                </Route>
                </Route>
                <Route path="user">
                <Route path="dashboard" element={<Dashboard />}>
                <Route path="home" element={<HomeScreen />} />
                <Route path="courses/:id" element={<CourseViewer />}>
                  <Route path="item/:nodeId" element={<CourseItemViewer />}></Route>
                </Route>
                  </Route>
                 </Route>
                </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
