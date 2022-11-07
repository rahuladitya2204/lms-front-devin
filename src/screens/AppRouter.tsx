import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AddTextItem from './post-authentication/User/Courses/CourseBuilder/UploadItems/AddTextItem/AddTextItem'
import CourseBuilderScreen from './post-authentication/User/Courses/CourseBuilder/CourseBuilderScreen'
import CourseDetailViewer from './non-authenticated/CourseDetailViewer/Layout-1'
import CourseEditor from './post-authentication/User/Courses/CourseBuilder/CourseEditor'
import CoursePlayerItem from './post-authentication/Learner/CoursePlayer/CoursePlayerItem'
import CoursePlayer from './post-authentication/Learner/CoursePlayer/CoursePlayer'
import CoursesScreen from './post-authentication/User/Courses/CoursesScreen'
import { Fragment } from 'react'
import HomeScreen from './post-authentication/User/Home/HomeScreen'
import InstructorEditor from './post-authentication/User/Users/Instructors/InstructorEditor'
import InstructorsScreen from './post-authentication/User/Users/Instructors/InstructorsScreen'
import LearnerDashboard from './post-authentication/Learner/Dashboard/DashboardScreen'
import LearnerLogin from './authentication/Learner/Login'
import LearnerRegister from './authentication/Learner/Register'
import RootScreen from './Root'
import UploadFileForm from './post-authentication/User/Courses/CourseBuilder/UploadItems/UploadFile/UploadFileForm'
import UploadPDFForm from './post-authentication/User/Courses/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from './post-authentication/User/Courses/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import UserDashboard from './post-authentication/User/Dashboard/DashboardScreen'
import UserLogin from './authentication/User/Login'
import UserRegister from './authentication/User/Register'
import useAuthentication from '../store/useAuthentication'
import LearnersScreen from './post-authentication/User/Users/Learners/LearnersScreen'
import LearnerEditor from './post-authentication/User/Users/Learners/LearnersEditor'

function AppRouter () {
  const { isSignedIn } = useAuthentication(state => state)
  console.log(isSignedIn, 'isSignedIn')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootScreen />}>
          <Route path="user">
            {isSignedIn ? (
              <Route path="dashboard" element={<UserDashboard />}>
                <Route path="home" element={<HomeScreen />} />
                <Route path="users">
                  <Route path="instructors">
                    <Route path="" element={<InstructorsScreen />} />
                    <Route path=":id/editor" element={<InstructorEditor />} />
                  </Route>
                  <Route path="learners">
                    <Route path="" element={<LearnersScreen />} />
                    <Route path=":id/editor" element={<LearnerEditor />} />
                  </Route>{' '}
                </Route>
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
                <Route path="courses/:id/editor" element={<CourseEditor />} />
              </Route>
            ) : (
              <Fragment>
                <Route path="register" element={<UserRegister />} />
                <Route path="login" element={<UserLogin />} />
              </Fragment>
            )}
            <Route
              path="*"
              element={<Navigate to="dashboard/home" replace />}
            />{' '}
          </Route>

          <Route path="learner">
            {isSignedIn ? (
              <Route path="dashboard" element={<LearnerDashboard />}>
                <Route path="home" element={<HomeScreen />} />
                <Route path="courses/:id" element={<CoursePlayer />}>
                  <Route path="item/:nodeId" element={<CoursePlayerItem />} />
                </Route>
              </Route>
            ) : (
              <Fragment>
                <Route path=":orgId/register" element={<LearnerRegister />} />
                <Route path=":orgId/login" element={<LearnerLogin />} />
              </Fragment>
            )}
            <Route
              path="*"
              element={<Navigate to="learner/dashboard/home" replace />}
            />{' '}
          </Route>
          <Route path="courses/:id" element={<CourseDetailViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
