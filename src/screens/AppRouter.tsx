import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  Routes
} from 'react-router-dom'

import CourseDetailViewer from './post-authentication/Learner/Screens/Courses/CourseDetailsViewer'
import { Fragment } from 'react'
import InstructorEditor from './post-authentication/User/Screens/Users/Instructors/InstructorEditor'
import InstructorsScreen from './post-authentication/User/Screens/Users/Instructors/InstructorsScreen'
import LearnerDashboard from './post-authentication/Learner/Screens/Dashboard/DashboardScreen'
import RootScreen from './Root'
import UserRegister from './post-authentication/User/Screens/Register'
import useAuthentication from '@Store/useAuthentication'
import LearnersScreen from './post-authentication/User/Screens/Users/Learners/LearnersScreen'
import LearnerEditor from './post-authentication/User/Screens/Users/Learners/LearnersEditor'
import UploadPDFForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import CourseBuilderScreen from './post-authentication/User/Screens/Courses/CourseBuilder'
import CoursesScreen from './post-authentication/User/Screens/Courses/CoursesScreen'
import UploadFileForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadFile/UploadFileForm'
import AddTextItem from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/AddTextItem'
import CourseEditor from './post-authentication/User/Screens/Courses/CourseBuilder/CourseEditor'
import LearnerCourses from './post-authentication/Learner/Screens/Courses'
import CoursePlayer from './post-authentication/Learner/Screens/CoursePlayer'
import CoursePlayerItem from './post-authentication/Learner/Screens/CoursePlayer/CoursePlayerItem'
import UserLoginScreen from './post-authentication/User/Screens/Login'
import UserDashboard from './post-authentication/User/Screens/Dashboard/DashboardScreen'
import LearnerRegister from './post-authentication/Learner/Screens/Register'
import LearnerLogin from './post-authentication/Learner/Screens/Login'
import CourseDetails from './post-authentication/Learner/Screens/Courses/CourseDetailsViewer/CourseDetails'
import LearnerHomeScreen from '@Learner/Screens/HomeScreen/HomeScreen'
import EnrolledCourseSuccessful from '@Learner/Screens/Courses/EnrolledCourse/EnrolledCourseSuccessful'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootScreen />}>
      <Route path="user">
        <Route path="dashboard" element={<UserDashboard />}>
          {/* <Route path="home" element={<HomeScreen />} /> */}
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
          <Route path="courses/:id/builder" element={<CourseBuilderScreen />}>
            <Route path="section/:sectionId">
              <Route path="pdf/:itemId" element={<UploadPDFForm />} />
              <Route path="video/:itemId" element={<UploadVideoForm />} />
              <Route path="text/:itemId" element={<AddTextItem />} />
              <Route path="file/:itemId" element={<UploadFileForm />} />
            </Route>
          </Route>
          <Route path="courses/:id/editor" element={<CourseEditor />} />
        </Route>
        <Route path="register" element={<UserRegister />} />
        <Route path="login" element={<UserLoginScreen />} />
        <Route
          path="*"
          // element={<Navigate to="dashboard/home" replace />}
        />{' '}
      </Route>

      <Route path="learner/:orgId">
        <Route path="dashboard" element={<LearnerDashboard />}>
          <Route path="home" element={<LearnerHomeScreen />} />
          <Route path="courses">
            <Route path="" element={<LearnerCourses />} />
            <Route path=":id/details" element={<CourseDetailViewer />} />
            <Route path=":id/enrolled" element={<EnrolledCourseSuccessful />} />
          </Route>
        </Route>
        <Route path="dashboard/courses/:id/player" element={<CoursePlayer />}>
          <Route
            path="section/:sectionId/item/:itemId"
            element={<CoursePlayerItem />}
          />
        </Route>
        <Route path="register" element={<LearnerRegister />} />
        <Route path="login" element={<LearnerLogin />} />
      </Route>

      <Route path="courses/preview" element={<CourseDetailViewer />} />
    </Route>
  )
)

function AppRouter () {
  const { isSignedIn } = useAuthentication(state => state)
  return <RouterProvider router={router} />
}

export default AppRouter
