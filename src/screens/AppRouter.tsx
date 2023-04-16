import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import AddPromoCode from '@User/Screens/Marketing/PromoCodes/CreatePromoCode'
import AddTextItem from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/AddTextItem'
import AppBuilderScreen from '@User/Screens/Builder/AppBuilder/AppBuilderScreen'
import AssetLibraryScreen from '@User/Screens/AssetLibrary/AssetLibrary'
import CampaignScreen from '@User/Screens/Marketing/CampaignScreen/CampaignScreen'
import CourseBuilderScreen from './post-authentication/User/Screens/Courses/CourseBuilder'
import CourseCategoryScreen from '@User/Screens/Courses/CourseCategory/CourseCategoryScreen'
import CourseDetailViewer from './post-authentication/Learner/Screens/Courses/CourseDetailsViewer'
import CourseEditor from './post-authentication/User/Screens/Courses/CourseBuilder/CourseEditor'
import CoursePlayer from './post-authentication/Learner/Screens/CoursePlayer'
import CoursePlayerItem from './post-authentication/Learner/Screens/CoursePlayer/CoursePlayerItem'
import CoursesScreen from './post-authentication/User/Screens/Courses/CoursesScreen'
import CreateCampaign from '@User/Screens/Marketing/CampaignScreen/CreateCampaign'
import CreatePackage from '@User/Screens/Packages/CreatePackage'
import EmailTemplateEditor from '@User/Screens/Marketing/Emails/Templates/EmailTemplateEditor'
import EmailTemplatesScreen from '@User/Screens/Marketing/Emails/Templates/EmailTemplatesScreen'
import EnrolledCourseSuccessful from '@Learner/Screens/Courses/EnrolledCourse/EnrolledCourseSuccessful'
import InstructorEditor from './post-authentication/User/Screens/Users/Instructors/InstructorEditor'
import InstructorsScreen from './post-authentication/User/Screens/Users/Instructors/InstructorsScreen'
import LearnerAccount from '@Learner/Screens/Account/Account'
import LearnerCart from '@Learner/Screens/Account/Cart/Cart'
import LearnerCourses from './post-authentication/Learner/Screens/Courses'
import LearnerDashboard from './post-authentication/Learner/Screens/Dashboard/DashboardScreen'
import LearnerEditor from './post-authentication/User/Screens/Users/Learners/LearnersEditor'
import LearnerStoreScreen from '@Learner/Screens/StoreScreen/StoreScreen'
import LearnerTicketDetail from '@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import LearnersScreen from './post-authentication/User/Screens/Users/Learners/LearnersScreen'
import LearnersTicketsScreen from '@Learner/Screens/Tickets/TicketsScreen/TicketsScreen'
import NotFoundScreen from './NotFoundScreen/NotFoundScreen'
import PackagesScreen from '@User/Screens/Packages/PackagesScreen'
import PromoCodesScreen from '@User/Screens/Marketing/PromoCodes/PromoCodesScreen'
import RootScreen from './Root'
import SettingsScreen from '@User/Screens/Settings/Settings'
import UploadPDFForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import UserAccount from '@User/Screens/Settings/Account/Account'
import UserDashboard from './post-authentication/User/Screens/Dashboard/DashboardScreen'
import UserLoginScreen from './post-authentication/User/Screens/Login'
import UserRegister from './post-authentication/User/Screens/Register'
import UserTicketDetail from '@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import UsersTicketsScreen from '@User/Screens/Tickets/TicketsScreen/TicketsScreen'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootScreen />}>
      <Route path=":orgId">
        <Route path="user">
          <Route path="dashboard" element={<UserDashboard />}>
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="asset-library" element={<AssetLibraryScreen />} />
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
            <Route path="builder">
              <Route path="app">
                <Route path="" element={<AppBuilderScreen />} />
                <Route path=":id/editor" element={<InstructorEditor />} />
              </Route>
            </Route>
            <Route path="marketing">
              <Route path="campaign">
                <Route path="" element={<CampaignScreen />} />
                {/* <Route path=":id/editor" element={<InstructorEditor />} /> */}
              </Route>
              <Route path="create-campaign" element={<CreateCampaign />} />
              <Route path="edit-campaign/:id" element={<CreateCampaign />} />
              <Route path="emails">
                <Route path="" element={<EmailTemplatesScreen />} />
                <Route path=":id/editor" element={<EmailTemplateEditor />} />
              </Route>
              <Route path="promo-codes">
                <Route path="" element={<PromoCodesScreen />} />
                <Route path=":id/editor" element={<AddPromoCode />} />
              </Route>
            </Route>
            <Route
              path="email-templates/:id/editor"
              element={<EmailTemplateEditor />}
            />{' '}
            <Route path="category">
              <Route path="" element={<CourseCategoryScreen />} />
              {/* <Route path=":id/editor" element={<LearnerEditor />} /> */}
            </Route>{' '}
            <Route path="settings">
              <Route path="account" element={<UserAccount />} />
            </Route>{' '}
            <Route path="tickets" element={<UsersTicketsScreen />} />
            <Route path="tickets/:id" element={<UserTicketDetail />} />
            <Route path="courses" element={<CoursesScreen />} />
            <Route path="courses/packages">
              <Route path="" element={<PackagesScreen />} />
              <Route path=":id/editor" element={<CreatePackage />} />
            </Route>
            <Route path="courses/:id/builder" element={<CourseBuilderScreen />}>
              <Route path="section/:sectionId">
                <Route path="pdf/:itemId" element={<UploadPDFForm />} />
                <Route path="video/:itemId" element={<UploadVideoForm />} />
                <Route path="text/:itemId" element={<AddTextItem />} />
                {/* <Route path="file/:itemId" element={<UploadFileForm />} /> */}
              </Route>
            </Route>
            <Route path="courses/:id/editor" element={<CourseEditor />} />
          </Route>
          <Route path="courses/:id/preview" element={<CourseDetailViewer />} />
          <Route path="register" element={<UserRegister />} />
          <Route path="login" element={<UserLoginScreen />} />
          <Route
            path="*"
            // element={<Navigate to="dashboard/home" replace />}
          />{' '}
        </Route>

        <Route path="learner">
          <Route path="dashboard" element={<LearnerDashboard />}>
            <Route path="cart" element={<LearnerCart />} />
            <Route path="store" element={<LearnerStoreScreen />} />
            <Route path="account" element={<LearnerAccount />} />
            <Route path="tickets" element={<LearnersTicketsScreen />} />
            <Route path="tickets/:id" element={<LearnerTicketDetail />} />
            <Route path="courses">
              <Route path="" element={<LearnerCourses />} />
              <Route path=":id" element={<CourseDetailViewer />} />
              <Route
                path=":id/enrolled"
                element={<EnrolledCourseSuccessful />}
              />
            </Route>
          </Route>
          <Route path="dashboard/courses/:id/player" element={<CoursePlayer />}>
            <Route
              path="section/:sectionId/item/:itemId"
              element={<CoursePlayerItem />}
            />
          </Route>

          {/* <Route path="register" element={<LearnerRegister />} />
        <Route path="login" element={<LearnerLogin />} /> */}
        </Route>
      </Route>
      <Route path="*" element={<NotFoundScreen />} />
    </Route>
  )
)

function AppRouter () {
  return <RouterProvider router={router} />
}

export default AppRouter
