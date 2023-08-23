import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import AddPromo from '@User/Screens/Marketing/Promos/CreatePromo'
import AddQuestion from '@User/Screens/LiveTests/LiveTestCreator/LiveTestBuilder/AddQuestionItem'
import AddTextItem from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/AddTextItem/AddTextItem'
import AppBuilderScreen from '@User/Screens/Builder/AppBuilder/AppBuilderScreen'
import AssetLibraryScreen from '@User/Screens/AssetLibrary/AssetLibrary'
import CampaignScreen from '@User/Screens/Marketing/CampaignScreen/CampaignScreen'
import CertificateTemplateEditor from '@User/Screens/CertificateTemplates/CertificateTemplateEditor'
import CourseAnalytics from '@User/Screens/Courses/CourseAnalytics/CourseAnalytics'
import CourseBuilderScreen from '@User/Screens/Courses/CourseEditor/CourseBuilder/CourseBuilderScreen'
import CourseDetailViewer from './post-authentication/Learner/Screens/Products/Courses/CourseDetailsViewer'
import CourseEditor from './post-authentication/User/Screens/Courses/CourseEditor'
import CourseInformationEditor from '@User/Screens/Courses/CourseEditor/CourseInformation'
import CoursePlayer from './post-authentication/Learner/Screens/CoursePlayer'
import CoursePlayerItem from './post-authentication/Learner/Screens/CoursePlayer/CoursePlayerItem'
import CoursesScreen from './post-authentication/User/Screens/Courses/CoursesScreen'
import CreateCampaign from '@User/Screens/Marketing/CampaignScreen/CreateCampaign/CreateCampaign'
import CreateLiveSession from '@User/Screens/LiveSession/CreateLiveSession/CreateLiveSession'
import CreateLiveTest from '@User/Screens/LiveTests/CreateLiveTest'
import CreatePackage from '@User/Screens/Packages/CreatePackage'
import CreateQuizForm from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/CreateQuizForm/CreateQuizForm'
import EmailTemplateEditor from '@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor'
import EmailTemplatesScreen from '@User/Screens/CertificateTemplates/CertificateTemplatesScreen'
import EnrolledCourseDetailScreen from '@Learner/Screens/EnrolledCourseDetail/EnrolledCourseDetailScreen'
import EnrolledCourseSuccessful from '@Learner/Screens/LearnerShop/EnrolledCourse/EnrolledCourseSuccessful'
import InstructorEditor from './post-authentication/User/Screens/Users/Instructors/InstructorEditor'
import InstructorsScreen from './post-authentication/User/Screens/Users/Instructors/InstructorsScreen'
import LearnerAccount from '@Learner/Screens/Account/Account'
import LearnerCart from '@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen'
import LearnerCourses from './post-authentication/Learner/Screens/Products/Courses'
import LearnerDeviceSelection from '@User/Screens/LiveSession/LiveSessionPlayer/Learner/LearnerDeviceSelection'
import LearnerEditor from './post-authentication/User/Screens/Users/Learners/LearnersEditor'
import LearnerLiveSessionPlayer from '@User/Screens/LiveSession/LiveSessionPlayer/Learner/LearnerLiveSessionPlayer'
import LearnerLiveSessionPlayerEnter from '@User/Screens/LiveSession/LiveSessionPlayer/Learner/index'
import LearnerLiveSessionsScreen from '@Learner/Screens/Products/LiveSession/LiveSessions/LiveSessionScreen'
import LearnerLiveTestDetailScreen from '@Learner/Screens/Products/LiveTest/LiveTestDetail/LiveTestDetail'
import LearnerLiveTestScreen from '@Learner/Screens/Products/LiveTest/LiveTestScreen/LiveTestsScreen'
import LearnerRootScreen from './post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen'
import LearnerStoreScreen from '@Learner/Screens/StoreScreen/StoreScreen'
import LearnerTicketDetail from '@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import LearnersScreen from './post-authentication/User/Screens/Users/Learners/LearnersScreen'
import LearnersTicketsScreen from '@Learner/Screens/Tickets/TicketsScreen/TicketsScreen'
import LiveSessionDetailScreen from '@Learner/Screens/Products/LiveSession/LiveSessionDetail'
import LiveTestBuilderScreen from '@User/Screens/LiveTests/LiveTestCreator/LiveTestBuilder/LiveTestBuilder'
import LiveTestCompleted from '@Learner/Screens/Products/LiveTest/LiveTestPlayer/LiveTestCompleted'
import LiveTestEditor from '@User/Screens/LiveTests/LiveTestCreator'
import LiveTestPlayer from '@Learner/Screens/Products/LiveTest/LiveTestPlayer/LiveTestPlayer'
import LiveTestPlayeritem from '@Learner/Screens/Products/LiveTest/LiveTestPlayer/LiveTestPlayerItem'
import LiveTestRules from '@Learner/Screens/Products/LiveTest/LiveTestPlayer/LiveTestRules'
import LiveTestStatus from '@User/Screens/LiveTests/LiveTestsList/LiveTestInsights/LiveTestStatus'
import NotFoundScreen from './NotFoundScreen/NotFoundScreen'
import OauthRedirect from '@Learner/Screens/OauthRedirect/OauthRedirectScreen'
import PackagesScreen from '@User/Screens/Packages/PackagesScreen'
import PaymentSettings from '@User/Screens/Settings/Payments/PaymentSettings'
import ProductCategoryScreen from '@User/Screens/Courses/ProductCategory/ProductCategoryScreen'
import PromosScreen from '@User/Screens/Marketing/Promos/PromosScreen'
import RootScreen from './Root'
import SettingsScreen from '@User/Screens/Settings/Settings'
import TemplatesScreen from '@User/Screens/Marketing/Templates/TemplatesScreen'
import UploadPDFForm from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import UserAccount from '@User/Screens/Settings/Account/Account'
import UserDashboard from '@User/Screens/UserDashboard/UserDashboard'
import UserDeviceSelection from '@User/Screens/LiveSession/LiveSessionPlayer/User/UserDeviceSelection'
import UserLiveSessionPlayer from '@User/Screens/LiveSession/LiveSessionPlayer/User/LiveSessionPlayer'
import UserLiveSessionPlayerEnter from '@User/Screens/LiveSession/LiveSessionPlayer/User/index'
import UserLiveSessionsScreen from '@User/Screens/LiveSession/LiveSessionScreen/LiveSessions'
import UserLiveTestScreen from '@User/Screens/LiveTests/LiveTestsList/LiveTestsScreen'
import UserLoginScreen from './post-authentication/User/Screens/Login'
import UserMeetingEnded from '@User/Screens/LiveSession/LiveSessionPlayer/User/UserMeetingEnded'
import UserRegister from './post-authentication/User/Screens/Register'
import UserRootScreen from './post-authentication/User/Screens/UserRoot/UserRootScreen'
import UserTicketDetail from '@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import UsersTicketsScreen from '@User/Screens/Tickets/TicketsScreen/TicketsScreen'
import WebpageViewer from '@User/Screens/Builder/Website/WebsiteBuilder/WebpageViewer'
import WebsiteBuilderScreen from '@User/Screens/Builder/Website/WebsiteBuilder/WebsiteBuilder'
import WebsiteScreen from '@User/Screens/Builder/Website/Website'
import WhatsappTemplateEditor from '@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor'
import WhatsappTemplatesScreen from '@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplatesScreen'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootScreen />}>
      <Route path=":orgId">
        <Route path="user">
          <Route path="webpage-viewer/:pageId" element={<WebpageViewer />} />
          <Route
            path="certificate-template/:id/editor"
            element={<CertificateTemplateEditor />}
          />
          <Route
            path="app/products/courses/:id/editor"
            element={<CourseEditor />}
          />
          <Route
            path="app/products/live-test/:id/editor"
            element={<LiveTestEditor />}
          />
          <Route
            path="app/products/courses/:id/builder"
            element={<CourseBuilderScreen />}
          >
            <Route path="">
              <Route path="pdf/:itemId" element={<UploadPDFForm />} />
              <Route path="video/:itemId" element={<UploadVideoForm />} />
              <Route path="text/:itemId" element={<AddTextItem />} />
              <Route path="quiz/:itemId" element={<CreateQuizForm />} />
              {/* <Route path="file/:itemId" element={<UploadFileForm />} /> */}
            </Route>
          </Route>
          <Route
            path="app/products/live-test/:id/builder"
            element={<LiveTestBuilderScreen />}
          >
            <Route path="">
              <Route path=":itemId" element={<AddQuestion />} />
              {/* <Route path="file/:itemId" element={<UploadFileForm />} /> */}
            </Route>
          </Route>
          <Route
            path="app/platform/website/builder/:pageId"
            element={<WebsiteBuilderScreen />}
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
            <Route path="platform">
              <Route path="app">
                <Route path="" element={<AppBuilderScreen />} />
                <Route path=":id/editor" element={<InstructorEditor />} />
              </Route>
              <Route path="website">
                <Route path="" element={<WebsiteScreen />} />
                {/* <Route path=":id/editor" element={<InstructorEditor />} /> */}
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
              {/* <Route path="" element={<ProductCategoryScreen />} /> */}
              {/* <Route path=":id/editor" element={<LearnerEditor />} /> */}
            </Route>{' '}
            <Route path="settings">
              <Route path="account" element={<UserAccount />} />
              <Route path="payments" element={<PaymentSettings />} />
            </Route>{' '}
            <Route path="tickets" element={<UsersTicketsScreen />} />
            <Route path="tickets/:id" element={<UserTicketDetail />} />
            <Route path="products">
              <Route path="courses">
                <Route path="" element={<CoursesScreen />} />
                <Route path=":id/analytics" element={<CourseAnalytics />} />
              </Route>
              <Route path="packages">
                <Route path="" element={<PackagesScreen />} />
                <Route path=":id/editor" element={<CreatePackage />} />
              </Route>
              <Route path="live-test">
                <Route path="" element={<UserLiveTestScreen />} />
                <Route path=":testId/status" element={<LiveTestStatus />} />
                <Route path="create" element={<CreateLiveTest />} />
                <Route path=":sessionId/edit" element={<CreateLiveTest />} />
              </Route>
            </Route>
            <Route path="live-session">
              <Route path="" element={<UserLiveSessionsScreen />} />
              <Route path="create" element={<CreateLiveSession />} />
              <Route path=":sessionId/edit" element={<CreateLiveSession />} />
            </Route>
            <Route
              path="courses/:id/editor/information"
              element={<CourseInformationEditor />}
            />
          </Route>
          <Route path="oauth/:provider/redirect" element={<OauthRedirect />} />
          <Route
            path="app/live-session/:sessionId/player"
            element={<UserLiveSessionPlayerEnter />}
          >
            <Route path="" element={<UserDeviceSelection />} />
            <Route
              path=":meetingId/session"
              element={<UserLiveSessionPlayer />}
            />
            <Route path="ended" element={<UserMeetingEnded />} />
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
            <Route path="live-test">
              <Route path="" element={<LearnerLiveTestScreen />} />
              <Route path=":testId" element={<LearnerLiveTestDetailScreen />} />
            </Route>
            <Route path="live-session">
              <Route path="" element={<LearnerLiveSessionsScreen />} />
              <Route path=":sessionId" element={<LiveSessionDetailScreen />} />
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
          <Route path="app/live-test/:testId">
            <Route path="start" element={<LiveTestRules />} />
            <Route path="player" element={<LiveTestPlayer />}>
              <Route path=":questionId" element={<LiveTestPlayeritem />} />
            </Route>
            <Route path="completed" element={<LiveTestCompleted />} />
          </Route>
          <Route path="oauth/:provider/redirect" element={<OauthRedirect />} />
          <Route path="app/courses/:id/player" element={<CoursePlayer />}>
            <Route path=":itemId" element={<CoursePlayerItem />} />
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
            <Route path="ended" element={<UserMeetingEnded />} />
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
