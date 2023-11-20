// import {
//   CourseBuilderScreen,
//   LearnerDeviceSelection,
//   LearnerLiveSessionPlayer,
//   LearnerLiveSessionPlayerEnter,
//   LearnerRootScreen,
//   NotFoundScreen,
//   UserDeviceSelection,
//   UserLiveSessionPlayer,
//   UserLiveSessionPlayerEnter,
//   WebpageViewer,
//   WebsiteBuilderScreen
// } from './route-list';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate
} from 'react-router-dom'

import AddPromo from '@User/Screens/Marketing/Promos/CreatePromo'
import AddQuestion from '@User/Screens/Tests/TestCreator/TestBuilder/AddQuestionItem'
import AddTextItem from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/AddTextItem/AddTextItem'
import AppBuilderScreen from '@User/Screens/Builder/AppBuilder/AppBuilderScreen'
import AssetLibraryScreen from '@User/Screens/AssetLibrary/AssetLibrary'
import CampaignScreen from '@User/Screens/Marketing/CampaignScreen/CampaignScreen'
import CategoriesScreen from '@User/Screens/Categories/CategoriesScreen'
import CertificateTemplateEditor from '@User/Screens/CertificateTemplates/CertificateTemplateEditor'
import CourseAnalytics from '@User/Screens/Courses/CourseAnalytics/CourseAnalytics'
import CourseBuilderScreen from '@User/Screens/Courses/CourseEditor/CourseBuilder/CourseBuilderScreen'
import CourseDetailViewer from './post-authentication/Learner/Screens/Products/Courses/CourseDetailsViewer'
import CourseEditor from './post-authentication/User/Screens/Courses/CourseEditor'
import CourseInformationEditor from '@User/Screens/Courses/CourseEditor/CourseInformation'
import CoursePlayer from '@Learner/Screens/CoursePlayer';
import CoursePlayerItem from '@Learner/Screens/CoursePlayer/CoursePlayerItem';
import CoursesScreen from './post-authentication/User/Screens/Courses/CoursesScreen'
import CreateCampaign from '@User/Screens/Marketing/CampaignScreen/CreateCampaign/CreateCampaign'
import CreateCategory from '@User/Screens/Categories/CreateCategory'
import CreateEvent from '@User/Screens/Event/CreateEvent/CreateEvent'
import CreatePackage from '@User/Screens/Packages/CreatePackage/CreatePackage'
import CreateQuizForm from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/CreateQuizForm/CreateQuizForm'
import CreateTest from '@User/Screens/Tests/CreateTest'
import EmailTemplateEditor from '@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor'
import EmailTemplatesScreen from '@User/Screens/CertificateTemplates/CertificateTemplatesScreen'
import EnrolledCourseDetailScreen from '@Learner/Screens/EnrolledCourseDetail/EnrolledCourseDetailScreen'
import EnrolledCourseSuccessful from '@Learner/Screens/LearnerShop/EnrolledCourse/EnrolledCourseSuccessful'
import EventDetailScreen from '@Learner/Screens/Products/Event/EventDetail'
import EventsScreen from '@User/Screens/Event/EventScreen/Events'
import InstructorEditor from './post-authentication/User/Screens/Users/Instructors/InstructorEditor'
import InstructorsScreen from './post-authentication/User/Screens/Users/Instructors/InstructorsScreen'
import LearnerAccount from '@Learner/Screens/Account/Account'
import LearnerCart from '@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen'
import LearnerCourses from './post-authentication/Learner/Screens/Products/Courses'
import LearnerEditor from './post-authentication/User/Screens/Users/Learners/LearnersEditor'
import LearnerEventsScreen from '@Learner/Screens/Products/Event/Events/EventScreen'
import LearnerFullPageHolder from './LearnerFullPageHolder';
import LearnerPrivacyPolicy from '@Learner/Screens/PrivacyPolicy/PrivacyPolicy'
import LearnerRootScreen from '@Learner/Screens/LearnerRoot/LearnerRootScreen'
import LearnerStoreScreen from '@Learner/Screens/StoreScreen/StoreScreen'
import LearnerTestDetailScreen from '@Learner/Screens/Products/Test/TestDetail/TestDetail'
import LearnerTestResult from '@Learner/Screens/Products/Test/TestResult/TestResult'
import LearnerTestScreen from '@Learner/Screens/Products/Test/TestScreen/TestsScreen'
import LearnerTicketDetail from '@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import LearnersScreen from './post-authentication/User/Screens/Users/Learners/LearnersScreen'
import LearnersTicketsScreen from '@Learner/Screens/Tickets/TicketsScreen/TicketsScreen'
import LoadingScreen from '@Components/LoadingScreen'
import MaintainenceScreen from './MaintainenceScreen/MaintainenceScreen'
import NotFoundScreen from './NotFoundScreen/NotFoundScreen'
import OauthRedirect from '@Learner/Screens/OauthRedirect/OauthRedirectScreen'
import PackagesScreen from '@User/Screens/Packages/PackagesScreen'
import PaymentSettings from '@User/Screens/Settings/Payments/PaymentSettings'
import PromosScreen from '@User/Screens/Marketing/Promos/PromosScreen'
import ResetPassword from '@Learner/Screens/Login/ResetPassword'
import RootScreen from './Root'
import SettingsScreen from '@User/Screens/Settings/Settings'
import { Store } from '@adewaskar/lms-common'
import TemplatesScreen from '@User/Screens/Marketing/Templates/TemplatesScreen'
import TestBuilderScreen from '@User/Screens/Tests/TestCreator/TestBuilder/TestBuilder'
import TestCompleted from '@Learner/Screens/Products/Test/TestPlayer/TestCompleted'
import TestEditor from '@User/Screens/Tests/TestCreator'
import TestMetrics from '@Learner/Screens/Products/Test/TestResult/TestMetrics'
import TestPlayer from '@Learner/Screens/Products/Test/TestPlayer/TestPlayer';
import TestPlayerItemReiew from '@Learner/Screens/Products/Test/TestReview/TestPlayerItemReview'
import TestPlayeritem from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/TestPlayerItem';
import TestResultTable from '@Learner/Screens/Products/Test/TestResult/Table/TestResultTable'
import TestReviewPlayer from '@Learner/Screens/Products/Test/TestReview/TestReviewPlayer'
import TestRules from '@Learner/Screens/Products/Test/TestPlayer/TestRules'
import TestStatus from '@User/Screens/Tests/TestsList/TestInsights/TestStatus'
import ThemeProvider from './ThemeProvider'
import UploadPDFForm from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm'
import UploadVideoForm from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm'
import UserAccount from '@User/Screens/Settings/Account/Account'
import UserDashboard from '@User/Screens/UserDashboard/UserDashboard'
import UserLoginScreen from './post-authentication/User/Screens/Login'
import UserMeetingEnded from '@User/Screens/Event/LiveSessionPlayer/User/UserMeetingEnded'
import UserProfile from '@User/Screens/Settings/Account/UserProfile';
import UserRegister from './post-authentication/User/Screens/Register'
import UserRootScreen from '@User/Screens/UserRoot/UserRootScreen'
import UserTestScreen from '@User/Screens/Tests/TestsList/TestsScreen'
import UserTicketDetail from '@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen'
import UsersTicketsScreen from '@User/Screens/Tickets/TicketsScreen/TicketsScreen'
import WebpageViewer from '@User/Screens/Builder/Website/WebsiteBuilder/WebpageViewer'
import WebsiteBuilderScreen from '@User/Screens/Builder/Website/WebsiteBuilder/WebsiteBuilder'
import WebsiteScreen from '@User/Screens/Builder/Website/Website'
import WhatsappTemplateEditor from '@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor'
import WhatsappTemplatesScreen from '@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplatesScreen'
import { useEffect } from 'react'

const router = (userType: string) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootScreen />}>
        {userType === 'learner' ? (
          <>
            <Route index element={<ReturnLearnerToStore />} />
   <Route path="app" element={<LearnerRootScreen />}>
              <Route path="cart" element={<LearnerCart />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="store" element={<LearnerStoreScreen />} />
              <Route path="account" element={<LearnerAccount />} />
              <Route path="tickets" element={<LearnersTicketsScreen />} />
              <Route path="tickets/:id" element={<LearnerTicketDetail />} />
              <Route path="courses">
                <Route path="" element={<LearnerCourses />} />
                <Route path=":id" element={<CourseDetailViewer />} />
              </Route>
              <Route path="test">
                <Route path="" element={<LearnerTestScreen />} />
                <Route path=":testId" element={<LearnerTestDetailScreen />} />
                {/* <Route path=":testId/result-table" element={<TestResultTable />} /> */}
              </Route>
              <Route path="event">
                <Route path="" element={<LearnerEventsScreen />} />
                <Route path=":eventId" element={<EventDetailScreen />} />
              </Route>
              <Route path="enrolled-courses">
                <Route
                  path=":courseId"
                  element={<EnrolledCourseDetailScreen />}
                />
              </Route>
              <Route
                path=":orderId/successful"
                element={<EnrolledCourseSuccessful />}
              />
                       <Route path='privacy-policy' element={<LearnerPrivacyPolicy/>} />
 </Route>
            <Route path="" element={<LearnerFullPageHolder/> }>
            <Route path="app/test/:testId">
              <Route path="start" element={<TestRules />} /> 
              <Route path="player" element={<TestPlayer/>}>
                <Route path=":questionId" element={<TestPlayeritem/>}/>
                </Route>
              <Route path="completed" element={<TestCompleted />} />
              {/* <Route path="result-table" element={<TestResultTable />} /> */}
 </Route>
            <Route
              path="oauth/:provider/redirect"
              element={<OauthRedirect />}
            />
            <Route path="app/courses/:id/player" element={<CoursePlayer />}>
              <Route path=":itemId" element={<CoursePlayerItem/>} />
            </Route>
            <Route path="app/test/:testId/result" element={<TestMetrics />} />
            <Route path="app/test/:testId/result/review" element={<TestReviewPlayer/>}>
                <Route path=":questionId" element={<TestPlayerItemReiew/>}/>
 </Route>
            </Route>
            <Route path="*" element={<NotFoundScreen />} />
 </>
        ) : <>
            <>
            <Route path="login" element={<UserLoginScreen />} />
            <Route path="webpage-viewer/:pageId" element={<WebpageViewer />} />
        <Route
          path="certificate-template/:id/editor"
          element={<CertificateTemplateEditor />}
        />
        <Route
          path="app/products/courses/:id/editor"
          element={<CourseEditor />}
        />
 <Route path="app/products/test/:id/editor" element={<TestEditor />} />
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
          path="app/products/test/:id/builder"
          element={<TestBuilderScreen />}
        >
          <Route path="">
            <Route path=":itemId" element={<AddQuestion />} />
            {/* <Route path="file/:itemId" element={<UploadFileForm />} /> */}
          </Route>
        </Route>
        <Route
          path="app/website/builder/:pageId"
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
                <Route path=":id/editor" element={<WhatsappTemplateEditor />} />
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
            <Route path="profile" element={<UserProfile />} />
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
              <Route path="create" element={<CreatePackage />} />
            <Route path=":packageId/edit" element={<CreatePackage />} />
                  </Route>
                  <Route path="category">
              <Route path="" element={<CategoriesScreen />} />
              <Route path="create" element={<CreateCategory />} />
            <Route path=":categoryId/edit" element={<CreateCategory />} />
            </Route>
            <Route path="test">
              <Route path="" element={<UserTestScreen />} />
              <Route path=":testId/status" element={<TestStatus />} />
              <Route path="create" element={<CreateTest />} />
              <Route path=":eventId/edit" element={<CreateTest />} />
            </Route>
          </Route>
          <Route path="event">
            <Route path="" element={<EventsScreen />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path=":eventId/edit" element={<CreateEvent />} />
          </Route>
          <Route
            path="courses/:id/editor/information"
            element={<CourseInformationEditor />}
          />
        </Route>
        <Route path="oauth/:provider/redirect" element={<OauthRedirect />} />
        {/* <Route
          path="app/event/:eventId/player"
          element={<UserLiveSessionPlayerEnter />}
        >
          <Route path="" element={<UserDeviceSelection />} />
          <Route
            path=":meetingId/session"
            element={<UserLiveSessionPlayer />}
          />
          <Route path="ended" element={<UserMeetingEnded />} />
        </Route> */}
        <Route path="courses/:id/preview" element={<CourseDetailViewer />} />

            </>
        <Route path="register" element={<UserRegister />} />
        {/* <Route path='/' element={<ReturnUserToHome/>} /> */}
        <Route path="*" element={<NotFoundScreen />} />

        </>}
        <Route path="lost" element={<NotFoundScreen />} />
        <Route path="under-maintenance" element={<MaintainenceScreen />} />
<Route path="*" element={<NotFoundScreen />} />
      </Route>
    )
  )
}

function AppRouter() {
  const userType = Store.useAuthentication(s => s.userType);
  // console.log(userType, 'userType');
  return  <RouterProvider router={router(userType)} />
}

export default AppRouter


const ReturnLearnerToStore = () => {
  // console.log('Learner: I am in return to store')
  const navigate = useNavigate();
  useEffect(() => { 
    navigate('/app/store')
  },[])
  return null;
}