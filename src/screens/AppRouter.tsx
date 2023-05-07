import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import AddPromo from '@User/Screens/Marketing/Promos/CreatePromo'
import AddTextItem from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/AddTextItem/AddTextItem'
import AppBuilderScreen from '@User/Screens/Builder/AppBuilder/AppBuilderScreen'
import AssetLibraryScreen from '@User/Screens/AssetLibrary/AssetLibrary'
import CampaignScreen from '@User/Screens/Marketing/CampaignScreen/CampaignScreen'
import CertificateTemplateEditor from '@User/Screens/CertificateTemplates/CertificateTemplateEditor'
import CourseBuilderScreen from './post-authentication/User/Screens/Courses/CourseBuilder'
import CourseCategoryScreen from '@User/Screens/Courses/CourseCategory/CourseCategoryScreen'
import CourseDetailViewer from './post-authentication/Learner/Screens/Courses/CourseDetailsViewer'
import CourseEditor from './post-authentication/User/Screens/Courses/CourseBuilder/CourseEditor'
import CoursePlayer from './post-authentication/Learner/Screens/CoursePlayer'
import CoursePlayerItem from './post-authentication/Learner/Screens/CoursePlayer/CoursePlayerItem'
import CoursesScreen from './post-authentication/User/Screens/Courses/CoursesScreen'
import CreateCampaign from '@User/Screens/Marketing/CampaignScreen/CreateCampaign/CreateCampaign'
import CreatePackage from '@User/Screens/Packages/CreatePackage'
import EmailTemplateEditor from '@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor'
import EmailTemplatesScreen from '@User/Screens/CertificateTemplates/CertificateTemplatesScreen'
import EnrolledCourseDetailScreen from '@Learner/Screens/EnrolledCourseDetail/EnrolledCourseDetailScreen'
import EnrolledCourseSuccessful from '@Learner/Screens/LearnerShop/EnrolledCourse/EnrolledCourseSuccessful'
import InstructorEditor from './post-authentication/User/Screens/Users/Instructors/InstructorEditor'
import InstructorsScreen from './post-authentication/User/Screens/Users/Instructors/InstructorsScreen'
import LearnerAccount from '@Learner/Screens/Account/Account'
import LearnerCart from '@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen'
import LearnerCourses from './post-authentication/Learner/Screens/Courses'
import LearnerEditor from './post-authentication/User/Screens/Users/Learners/LearnersEditor'
import LearnerLiveSessionPlayer from '@User/Screens/LiveSession/LiveSessionPlayer/Learner/LearnerLiveSessionPlayer'
import LearnerRootScreen from './post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen'
import LearnerStoreScreen from '@Learner/Screens/StoreScreen/StoreScreen'
import LearnerTicketDetail from '@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import LearnersScreen from './post-authentication/User/Screens/Users/Learners/LearnersScreen'
import LearnersTicketsScreen from '@Learner/Screens/Tickets/TicketsScreen/TicketsScreen'
import LiveSessionsScreen from '@User/Screens/LiveSession/LiveSessionsScreen'
import NotFoundScreen from './NotFoundScreen/NotFoundScreen'
import PackagesScreen from '@User/Screens/Packages/PackagesScreen'
import PromosScreen from '@User/Screens/Marketing/Promos/PromosScreen'
import RootScreen from './Root'
import SettingsScreen from '@User/Screens/Settings/Settings'
import TemplatesScreen from '@User/Screens/Marketing/Templates/TemplatesScreen'
import UploadPDFForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from './post-authentication/User/Screens/Courses/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import UserAccount from '@User/Screens/Settings/Account/Account'
import UserDashboard from '@User/Screens/UserDashboard/UserDashboard'
import UserLoginScreen from './post-authentication/User/Screens/Login'
import UserRegister from './post-authentication/User/Screens/Register'
import UserRootScreen from './post-authentication/User/Screens/UserRoot/UserRootScreen'
import UserTicketDetail from '@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import UsersTicketsScreen from '@User/Screens/Tickets/TicketsScreen/TicketsScreen'
import WhatsappTemplateEditor from '@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor'
import WhatsappTemplatesScreen from '@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplatesScreen'
import LearnerDeviceSelection from '@User/Screens/LiveSession/LiveSessionPlayer/Learner/LearnerDeviceSelection'
import UserDeviceSelection from '@User/Screens/LiveSession/LiveSessionPlayer/User/UserDeviceSelection'
import UserLiveSessionPlayerEnter from '@User/Screens/LiveSession/LiveSessionPlayer/User/index'
import LearnerLiveSessionPlayerEnter from '@User/Screens/LiveSession/LiveSessionPlayer/Learner/index'
import UserLiveSessionPlayer from '@User/Screens/LiveSession/LiveSessionPlayer/User/LiveSessionPlayer'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootScreen />}>
      <Route path=":orgId">
        <Route path="user">
          <Route
            path="certificate-template/:id/editor"
            element={<CertificateTemplateEditor />}
          />
          <Route path="app" element={<UserRootScreen />}>
            <Route path="dashboard" element={<UserDashboard />} />
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
              <Route path="templates" element={<TemplatesScreen />}>
                <Route path="emails">
                  <Route path="" element={<EmailTemplatesScreen />} />
                  <Route path=":id/editor" element={<EmailTemplateEditor />} />
                </Route>
                <Route path="whatsapp">
                  <Route path="" element={<WhatsappTemplatesScreen />} />
                  <Route
                    path=":id/editor"
                    element={<WhatsappTemplateEditor />}
                  />
                </Route>
              </Route>
              <Route path="promo-codes">
                <Route path="" element={<PromosScreen />} />
                <Route path=":id/editor" element={<AddPromo />} />
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
            <Route path="live-session">
              <Route path="" element={<LiveSessionsScreen />} />
              {/* <Route path=":id/editor" element={<CreatePackage />} /> */}
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
          <Route
            path="app/live-session/:sessionId/player"
            element={<UserLiveSessionPlayerEnter />}
          >
            <Route path="" element={<UserDeviceSelection />} />
            <Route
              path=":meetingId/session"
              element={<UserLiveSessionPlayer />}
            />
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
          <Route path="app" element={<LearnerRootScreen />}>
            <Route path="cart" element={<LearnerCart />} />
            <Route path="store" element={<LearnerStoreScreen />} />
            <Route path="account" element={<LearnerAccount />} />
            <Route path="tickets" element={<LearnersTicketsScreen />} />
            <Route path="tickets/:id" element={<LearnerTicketDetail />} />
            <Route path="courses">
              <Route path="" element={<LearnerCourses />} />
              <Route path=":id" element={<CourseDetailViewer />} />
            </Route>
            <Route path="enrolled-courses">
              {/* <Route path="" element={<LearnerCourses />} /> */}
              <Route
                path=":courseId"
                element={<EnrolledCourseDetailScreen />}
              />
            </Route>
            <Route
              path=":orderId/successful"
              element={<EnrolledCourseSuccessful />}
            />
          </Route>
          <Route path="app/courses/:id/player" element={<CoursePlayer />}>
            <Route
              path="section/:sectionId/item/:itemId"
              element={<CoursePlayerItem />}
            />
          </Route>

          <Route
            path="app/live-session/:sessionId/player"
            element={<LearnerLiveSessionPlayerEnter />}
          >
            <Route path="" element={<LearnerDeviceSelection />} />
            <Route
              path=":meetingId/session"
              element={<LearnerLiveSessionPlayer />}
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
