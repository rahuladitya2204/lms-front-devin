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
} from "react-router-dom";

import AddPromo from "@User/Screens/Marketing/Promos/CreatePromo";
import AddQuestion from "@User/Screens/Tests/TestCreator/TestBuilder/AddQuestionItem";
import AddTextItem from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/AddTextItem/AddTextItem";
import AffiliateProgramScren from "@User/Screens/Marketing/AffiliateScreen/AffiliateScreen";
import AffiliateScreen from "@Learner/Screens/Affiliate/AffiliateScreen";
import AnswerSheet from "@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/AnswerSheet";
import AnswerSheetFiles from "@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/AnswerSheetFiles";
import AppBuilderScreen from "@User/Screens/Builder/AppBuilder/AppBuilderScreen";
import AssetLibraryScreen from "@User/Screens/AssetLibrary/AssetLibrary";
import CampaignScreen from "@User/Screens/Marketing/CampaignScreen/CampaignScreen";
import CategoriesScreen from "@User/Screens/Categories/CategoriesScreen";
import CategoryDetail from "@Learner/Screens/StoreScreen/CategoryDetail";
import CertificateTemplateEditor from "@User/Screens/CertificateTemplates/CertificateTemplateEditor";
import CourseAnalytics from "@User/Screens/Courses/CourseAnalytics/CourseAnalytics";
import CourseBuilderScreen from "@User/Screens/Courses/CourseEditor/CourseBuilder/CourseBuilderScreen";
import CourseDetailViewer from "./post-authentication/Learner/Screens/Products/Courses/CourseDetailsViewer";
import CourseEditor from "./post-authentication/User/Screens/Courses/CourseEditor";
import CourseInformationEditor from "@User/Screens/Courses/CourseEditor/CourseInformation";
import CoursePlayer from "@Learner/Screens/CoursePlayer";
import CoursePlayerItem from "@Learner/Screens/CoursePlayer/CoursePlayerItem";
import CoursesScreen from "./post-authentication/User/Screens/Courses/CoursesScreen";
import CreateCampaign from "@User/Screens/Marketing/CampaignScreen/CreateCampaign/CreateCampaign";
import CreateCategory from "@User/Screens/Categories/CreateCategory";
import CreateEvent from "@User/Screens/Event/CreateEvent/CreateEvent";
import CreatePackage from "@User/Screens/Packages/CreatePackage/CreatePackage";
import CreateQuizForm from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/CreateQuizForm/CreateQuizForm";
import CreateTest from "@User/Screens/Tests/CreateTest";
import EmailTemplateEditor from "@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor";
import EmailTemplatesScreen from "@User/Screens/CertificateTemplates/CertificateTemplatesScreen";
import EnrolledCourseDetailScreen from "@Learner/Screens/EnrolledCourseDetail/EnrolledCourseDetailScreen";
import EnrolledCourseSuccessful from "@Learner/Screens/LearnerShop/EnrolledCourse/EnrolledCourseSuccessful";
import EnrolledPackageDetailScreen from "@Learner/Screens/Products/Package/PackageDetailsViewer/EnrolledPackage/EnrolledPackageDetail";
import EventDetailScreen from "@Learner/Screens/Products/Event/EventDetail";
import EventsScreen from "@User/Screens/Event/EventScreen/Events";
import ImageResizer from "@Components/ImageResizer/ImageResizer";
import LearnerAccount from "@Learner/Screens/Account/Account";
import LearnerCart from "@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen";
import LearnerCourses from "./post-authentication/Learner/Screens/Products/Courses";
import LearnerEditor from "./post-authentication/User/Screens/Users/Learners/LearnersEditor";
import LearnerEventsScreen from "@Learner/Screens/Products/Event/Events/EventScreen";
import LearnerHomeScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/HomeScreen/HomeScreen";
import LearnerPrivacyPolicy from "@Learner/Screens/ExtraPages/PrivacyPolicy";
import LearnerStoreScreen from "@Learner/Screens/StoreScreen/StoreScreen";
import LearnerTestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";
import LearnerTestResult from "@Learner/Screens/Products/Test/TestResult/TestResult";
import LearnerTestScreen from "@Learner/Screens/Products/Test/TestScreen/TestsScreen";
import LearnerTicketDetail from "@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen";
import LearnerWallet from "@Learner/Screens/Account/LearnerWallet/LearnerWallet";
import LearnersScreen from "./post-authentication/User/Screens/Users/Learners/LearnersScreen";
import LearnersTicketsScreen from "@Learner/Screens/Tickets/TicketsScreen/TicketsScreen";
import LoadingScreen from "@Components/LoadingScreen";
import MaintainenceScreen from "./MaintainenceScreen/MaintainenceScreen";
import NewsDetailScreen from "@Learner/Screens/News/NewsDetailScreen";
import NewsScreen from "@User/Screens/Admin/News/NewsScreen";
import NotFoundScreen from "./NotFoundScreen/NotFoundScreen";
import OMRComponent from "@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent";
import OauthRedirect from "@Learner/Screens/OauthRedirect/OauthRedirectScreen";
import OrganisationScreen from "@User/Screens/Admin/Organisations/OrganisationsScreen";
import PackageDetailViewer from "@Learner/Screens/Products/Package/PackageDetailsViewer";
import PackagesScreen from "@User/Screens/Packages/PackagesScreen";
import PaymentSettings from "@User/Screens/Settings/Payments/PaymentSettings";
import PerspectiveCropper from "@Components/PerspectiveCropper";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import ProductCategoryEditor from "@User/Screens/Categories/ProductCategoryCreator";
import PromosScreen from "@User/Screens/Marketing/Promos/PromosScreen";
import ResetPassword from "@Learner/Screens/Login/ResetPassword";
import RootScreen from "./Root";
import SettingsScreen from "@User/Screens/Settings/Settings";
import { Store } from "@adewaskar/lms-common";
import TemplatesScreen from "@User/Screens/Marketing/Templates/TemplatesScreen";
import Test from "@User/Screens/Test";
import TestAnswerSheet from "@User/Screens/Tests/TestsList/TestInsights/TestAnswerSheet";
import TestBuilderScreen from "@User/Screens/Tests/TestCreator/TestBuilder/TestBuilder";
import TestCompleted from "@Learner/Screens/Products/Test/TestPlayer/TestCompleted";
import TestEditor from "@User/Screens/Tests/TestCreator";
import TestEvaluator from "@User/Screens/Tests/TestEvaluator/TestEvaluatorScreen";
import TestMetrics from "@Learner/Screens/Products/Test/TestResult/TestMetrics";


import TestPlayerItemReiew from "@Learner/Screens/Products/Test/TestReview/TestPlayerItemReview";
import TestPlayeritem from "@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/TestPlayerItem";
import TestResultTable from "@Learner/Screens/Products/Test/TestResult/Table/TestResultTable";
import TestRules from "@Learner/Screens/Products/Test/TestPlayer/TestRules";
import TestStatus from "@User/Screens/Tests/TestsList/TestInsights/TestStatus";
import ThemeProvider from "./ThemeProvider";
import TopicsScreen from "@User/Screens/Admin/Topics/TopicsScreen";
import UploadAnswerSheets from "@User/Screens/Tests/TestCreator/TestBuilder/UploadAnswerSheets";
import UploadPDFForm from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm";
import UploadVideoForm from "@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm";
import UserAccount from "@User/Screens/Settings/Account/Account";
import UserDashboard from "@User/Screens/UserDashboard/UserDashboard";
import UserEditor from "./post-authentication/User/Screens/Users/Users/UserEditor";
import UserFullPageHolder from "@User/Screens/UserRoot/UserFullPageHolder";
import UserLoginScreen from "./post-authentication/User/Screens/Login";
import UserProfile from "@User/Screens/Settings/Account/UserProfile";
import UserRegister from "./post-authentication/User/Screens/Register";
const LearnerRootScreen = lazy(() => import("@Learner/Screens/LearnerRoot/LearnerRootScreen"));
const UserRootScreen = lazy(() => import("@User/Screens/UserRoot/UserRootScreen"));
const TestPlayer = lazy(() => import("@Learner/Screens/Products/Test/TestPlayer/TestPlayer"));
const TestReviewPlayer = lazy(() => import("@Learner/Screens/Products/Test/TestReview/TestReviewPlayer"));
const TestPublicPlayer = lazy(() => import("./post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayer"));
const LearnerFullPageHolder = lazy(() => import("./LearnerFullPageHolder"));

import UserTestScreen from "@User/Screens/Tests/TestsList/TestsScreen";
import UserTicketDetail from "@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen";
import UsersScreen from "./post-authentication/User/Screens/Users/Users/UsersScreen";
import UsersTicketsScreen from "@User/Screens/Tickets/TicketsScreen/TicketsScreen";
import WhatsappTemplateEditor from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor";
import WhatsappTemplatesScreen from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplatesScreen";
import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "@Router/index";
import RoutingContext from "./RoutingContext";
import ProductCategoryTabs from "./post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import PackageDetailsTabs from "./post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailTabs";
import TestPublicPlayerItemReiew from "./post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayerItem";
import CreateBlog from "@User/Screens/Blog/CreateBlog";
import BlogsScreen from "@User/Screens/Blog/BlogScreen";
import BlogDetailScreen from "./post-authentication/Learner/Screens/Blog/BlogDetail";
import LearnerBlogsScreen from "./post-authentication/Learner/Screens/Blog/BlogsScreen";
import PackageInformationEditor from "@User/Screens/Packages/CreatePackage/CreatePackage";
import PackagesList from "./post-authentication/Learner/Screens/Products/Package/PackagesList/PackagesListScreen";
import PYQPapersScreen from "./post-authentication/Learner/Screens/Products/Test/PYQPapers/PYQPapersScreen";
import Fullscreen from "@Components/Fullscreen";
import InterviewRecorder from "./post-authentication/Learner/Screens/Interview/InterviewRecorder";
import AffiliatesScreen from "@User/Screens/Users/Affiliates/AffiliatesScreen";
import CreatePlan from "@User/Screens/ExtraComponents/CreatePlan";
import PlansScreen from "@User/Screens/Plans/PlansScreen";
import { Card, Col, Row } from "antd";
import LearnerLogin from "./post-authentication/Learner/Screens/Login";
import TextsScreen from "@User/Screens/Admin/Texts/TextsScreen";

const router = (userType: string) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/hello-world" element={<h1>Working Next</h1>} />
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<RootScreen />}>
          {userType === "learner" ? (
            <>
              <Route index element={<ReturnLearnerToStore />} />
              <Route path="app" element={
                <Suspense fallback={<LoadingScreen />}>
                  <LearnerRootScreen />
                </Suspense>
              }>
                <Route path="cart" element={<LearnerCart />} />
                <Route path="wallet" element={<LearnerWallet />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route
                  path="exam/:id"
                  element={<ProductCategoryDetailScreen />}
                >
                  {/* <Route
                    path=":product/:type"
                    element={<CategoryProducts isServer={false} />}
                  > */}
                  <Route
                    path=":type"
                    element={<ProductCategoryTabs isServer={false} />}
                  />
                  {/* </Route> */}
                </Route>
                {/* <Route path="store" element={<LearnerStoreScreen />} /> */}
                <Route path="store" element={<LearnerHomeScreen />} />
                <Route path="blog" element={<LearnerBlogsScreen />} />
                <Route path="blog/:id" element={<BlogDetailScreen />} />
                <Route path="account" element={<LearnerAccount />} />
                <Route path="tickets" element={<LearnersTicketsScreen />} />
                <Route path="tickets/:id" element={<LearnerTicketDetail />} />
                <Route path="courses">
                  <Route path="" element={<LearnerCourses />} />
                  <Route path=":id" element={<CourseDetailViewer />} />
                </Route>
                <Route path="test-series/:id" element={<PackageDetailViewer />}>
                  <Route
                    path=":type"
                    element={<PackageDetailsTabs isServer={false} />}
                  />
                </Route>
                <Route path="previous-year-papers">
                  {/* <Route path="" element={<LearnerCourses />} /> */}
                  <Route path=":slug" element={<PYQPapersScreen />} />
                </Route>
                <Route path="test-series">
                  {/* <Route path="" element={<LearnerCourses />} /> */}
                  <Route path=":slug" element={<PackagesList />} />
                  {/* <Route path=":slug/:exam" element={<PackagesExamScreen />} /> */}
                  <Route
                    path=":packageId/enrolled-package"
                    element={
                      <SigninProtectedRoutes>
                        <EnrolledPackageDetailScreen />
                      </SigninProtectedRoutes>
                    }
                  />
                </Route>
                <Route path="test">
                  <Route path="" element={<LearnerTestScreen />} />
                  <Route path=":testId" element={<LearnerTestDetailScreen />} />
                  {/* <Route path=":testId/answer-sheet" element={<AnswerSheet />} />  */}
                  {/* <Route path=":testId/result-table" element={<TestResultTable />} /> */}
                </Route>
                <Route path="event">
                  <Route path="" element={<LearnerEventsScreen />} />
                  <Route path=":eventId" element={<EventDetailScreen />} />
                </Route>
                <Route
                  path=":courseId/enrolled-course"
                  element={
                    <SigninProtectedRoutes>
                      <EnrolledCourseDetailScreen />
                    </SigninProtectedRoutes>
                  }
                />
                {/* <Route path="enrolled-package">
                <Route
                  path=":packageId"
                  element={<EnrolledPackageDetailScreen />}
                />
              </Route> */}
                <Route
                  path=":orderId/successful"
                  element={<EnrolledCourseSuccessful />}
                />
                <Route path="policies" element={<LearnerPrivacyPolicy />} />
              </Route>
              <Route path="" element={
                <Suspense fallback={<LoadingScreen />}>
                  <LearnerFullPageHolder />
                </Suspense>
              }>
                {/* <Route
                  path="app/interview/player"
                  element={<UserEventPlayerEnter />}
                >
                  <Route path="" element={<UserDeviceSelection />} />
                  <Route path=":meetingId/session" element={<EventPlayer />} />
                  <Route path="ended" element={<UserMeetingEnded />} />
                </Route> */}
                <Route path="app/interview" element={<InterviewRecorder />} />
                <Route path="app/news" element={<NewsDetailScreen />} />
                <Route path="image-resizer" element={<ImageResizer />} />
                {/* <Route path="cropper" element={<PerspectiveCropper />} />  */}
                <Route path="affiliate" element={<AffiliateScreen />} />
                <Route path="app/test/:testId">
                  <Route
                    path="start"
                    element={
                      <SigninProtectedRoutes>
                        <TestRules />
                      </SigninProtectedRoutes>
                    }
                  />
                  <Route
                    path="answer-sheet"
                    element={
                      <SigninProtectedRoutes>
                        <AnswerSheet />
                      </SigninProtectedRoutes>
                    }
                  />
                  <Route
                    path="upload-answer-sheet"
                    element={
                      <SigninProtectedRoutes>
                        <AnswerSheetFiles />
                      </SigninProtectedRoutes>
                    }
                  />
                  {/* <Route path="pyq" element={<TestPublicPlayer />}>
                    <Route
                      path=":questionId"
                      element={<TestPublicPlayerItemReiew />}
                    />
                  </Route> */}
                  <Route
                    path="player"
                    element={
                      <SigninProtectedRoutes>
                        <Suspense fallback={<LoadingScreen />}>
                          <TestPlayer />
                        </Suspense>
                      </SigninProtectedRoutes>
                    }
                  >
                    <Route path=":questionId" element={<TestPlayeritem />} />
                  </Route>
                  <Route path="completed" element={<TestCompleted />} />
                  {/* <Route path="result-table" element={<TestResultTable />} /> */}
                </Route>
                <Route
                  path="oauth/:provider/redirect"
                  element={<OauthRedirect />}
                />
                <Route path="app/courses/:id/player" element={<CoursePlayer />}>
                  <Route path=":itemId" element={<CoursePlayerItem />} />
                </Route>
                <Route
                  path="app/test/:testId/result"
                  element={
                    <SigninProtectedRoutes>
                      <TestMetrics />
                    </SigninProtectedRoutes>
                  }
                />
                <Route
                  path="app/test/:testId/review"
                  element={
                    <SigninProtectedRoutes>
                      <Suspense fallback={<LoadingScreen />}>
                        <TestReviewPlayer />
                      </Suspense>
                    </SigninProtectedRoutes>
                  }
                >
                  <Route path=":questionId" element={<TestPlayerItemReiew />} />
                </Route>
              </Route>
              <Route
                path="app/test/:testId"
                element={<LearnerFullPageHolder noSignIn />}
              >
                <Route
                  path="previous-year-questions"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <TestPublicPlayer />
                    </Suspense>
                  }
                >
                  <Route
                    path=":questionId"
                    element={<TestPublicPlayerItemReiew />}
                  />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundScreen />} />
            </>
          ) : (
            <>
              <>
                <Route path="" element={<UserFullPageHolder />}>
                  <Route
                    path="admin/test/:testId/answer-sheet/:learnerId"
                    element={<TestAnswerSheet />}
                  />
                  <Route
                    path="admin/test/:testId/answer-sheet/:learnerId/upload-answer-sheet"
                    element={<AnswerSheetFiles />}
                  />
                  <Route
                    path="admin/test/:testId/answer-sheet/upload"
                    element={<UploadAnswerSheets />}
                  />
                  <Route path="login" element={<UserLoginScreen />} />
                  {/* <Route
                    path="webpage-viewer/:pageId"
                    element={<WebpageViewer />}
                  /> */}
                  <Route
                    path="certificate-template/:id/editor"
                    element={<CertificateTemplateEditor />}
                  />
                  <Route
                    path="admin/products/courses/:id/editor"
                    element={<CourseEditor />}
                  />
                  <Route
                    path="admin/products/test/:id/editor"
                    element={<TestEditor />}
                  />
                  <Route
                    path="admin/products/package/:packageId/editor"
                    element={<PackageInformationEditor />}
                  />
                  {/* <Route path=":packageId/edit" element={<CreatePackage />} /> */}
                  <Route
                    path="admin/products/category/:id/editor"
                    element={<ProductCategoryEditor />}
                  />
                  <Route
                    path="admin/products/courses/:id/builder"
                    element={<CourseBuilderScreen />}
                  >
                    <Route path="">
                      <Route path="pdf/:itemId" element={<UploadPDFForm />} />
                      <Route
                        path="video/:itemId"
                        element={<UploadVideoForm />}
                      />
                      <Route path="text/:itemId" element={<AddTextItem />} />
                      <Route path="quiz/:itemId" element={<CreateQuizForm />} />
                      {/* <Route path="file/:itemId" element={<UploadFileForm />} /> */}
                    </Route>
                  </Route>
                  <Route
                    path="admin/products/test/:id/evaluator"
                    element={<TestEvaluator />}
                  ></Route>
                  <Route
                    path="admin/products/test/:id/builder"
                    element={<TestBuilderScreen />}
                  >
                    <Route path="">
                      <Route path=":itemId" element={<AddQuestion />} />
                      {/* <Route path="file/:itemId" element={<UploadFileForm />} /> */}
                    </Route>
                  </Route>
                  {/* <Route
                    path="admin/website/builder/:pageId"
                    element={<WebsiteBuilderScreen />}
                  /> */}
                </Route>

                <Route path="admin" element={<Suspense fallback={<LoadingScreen />}><UserRootScreen /></Suspense>}>
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="admin/news" element={<NewsScreen />} />
                  <Route
                    path="admin/organisation"
                    element={<OrganisationScreen />}
                  />
                  <Route
                    path="admin/texts"
                    element={<TextsScreen />}
                  />
                  <Route path="admin/topics" element={<TopicsScreen />} />
                  <Route path="settings" element={<SettingsScreen />} />
                  <Route
                    path="asset-library"
                    element={<AssetLibraryScreen />}
                  />
                  <Route path="users">
                    <Route path="users">
                      <Route path="" element={<UsersScreen />} />
                      <Route path=":id/editor" element={<UserEditor />} />
                    </Route>
                    <Route path="learners">
                      <Route path="" element={<LearnersScreen />} />
                      <Route path=":id/editor" element={<LearnerEditor />} />
                    </Route>
                    <Route path="affiliates">
                      <Route path="" element={<AffiliatesScreen />} />
                    </Route>
                  </Route>
                  <Route path="platform">
                    <Route path="app">
                      <Route path="" element={<AppBuilderScreen />} />
                      <Route path=":id/editor" element={<UserEditor />} />
                    </Route>
                    <Route path="website">
                      {/* <Route path="" element={<WebsiteScreen />} /> */}
                      {/* <Route path=":id/editor" element={<UserEditor />} /> */}
                    </Route>
                  </Route>
                  <Route path="marketing">
                    <Route path="campaign">
                      <Route path="" element={<CampaignScreen />} />
                      {/* <Route path=":id/editor" element={<UserEditor />} /> */}
                    </Route>
                    <Route path="affiliate">
                      <Route path="" element={<AffiliateProgramScren />} />
                      {/* <Route path=":id/editor" element={<UserEditor />} /> */}
                    </Route>
                    <Route
                      path="create-campaign"
                      element={<CreateCampaign />}
                    />
                    <Route
                      path="edit-campaign/:id"
                      element={<CreateCampaign />}
                    />
                    <Route path="templates" element={<TemplatesScreen />}>
                      <Route path="emails">
                        <Route path="" element={<EmailTemplatesScreen />} />
                        <Route
                          path=":id/editor"
                          element={<EmailTemplateEditor />}
                        />
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
                  <Route path="blogs">
                    <Route path="" element={<BlogsScreen />} />
                    <Route path="create" element={<CreateBlog />} />
                    <Route path=":blogId/edit" element={<CreateBlog />} />
                  </Route>
                  <Route
                    path="email-templates/:id/editor"
                    element={<EmailTemplateEditor />}
                  />{" "}
                  <Route path="category">
                    {/* <Route path="" element={<ProductCategoryScreen />} /> */}
                    {/* <Route path=":id/editor" element={<LearnerEditor />} /> */}
                  </Route>{" "}
                  <Route path="settings">
                    <Route path="account" element={<UserAccount />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="payments" element={<PaymentSettings />} />
                  </Route>{" "}
                  <Route path="tickets" element={<UsersTicketsScreen />} />
                  <Route path="tickets/:id" element={<UserTicketDetail />} />
                  <Route path="products">
                    <Route path="courses">
                      <Route path="" element={<CoursesScreen />} />
                      <Route
                        path=":id/analytics"
                        element={<CourseAnalytics />}
                      />
                    </Route>
                    <Route path="packages">
                      <Route path="" element={<PackagesScreen />} />
                      {/* <Route path="create" element={<CreatePackage />} />
                      <Route
                        path=":packageId/edit"
                        element={<CreatePackage />}
                      /> */}
                    </Route>
                    <Route path="category">
                      <Route path="" element={<CategoriesScreen />} />
                      <Route path="create" element={<CreateCategory />} />
                      <Route
                        path=":categoryId/edit"
                        element={<CreateCategory />}
                      />
                    </Route>
                    <Route path="plan">
                      <Route path="" element={<PlansScreen />} />
                      {/* <Route
                        path="create"
                        element={<CreatePlan mode="global" />}
                      /> */}
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
                <Route
                  path="oauth/:provider/redirect"
                  element={<OauthRedirect />}
                />
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
                <Route
                  path="courses/:id/preview"
                  element={<CourseDetailViewer />}
                />
              </>
              <Route path="register" element={<UserRegister />} />
              {/* <Route path='/' element={<ReturnUserToHome/>} /> */}
              <Route path="*" element={<NotFoundScreen />} />
            </>
          )}
          <Route path="lost" element={<NotFoundScreen />} />
          <Route path="under-maintenance" element={<MaintainenceScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Route>
      </>
    )
  );
};

function AppRouter() {
  const userType = Store.useAuthentication((s) => s.userType);
  // console.log(userType, 'userType');
  return (
    <RoutingContext.Provider value={{ isBrowserRouter: true }}>
      <RouterProvider router={router(userType)} />
    </RoutingContext.Provider>
  );
}

export default AppRouter;

const ReturnLearnerToStore = () => {
  // console.log('Learner: I am in return to store')
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/app/store");
  }, []);
  return null;
};

const SigninProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const isSignedIn = Store.useAuthentication((s) => s.isSignedIn);
  return isSignedIn ? (
    children
  ) : (
    <Row justify={"center"} align={"middle"}>
      <Col>
        <Card style={{ marginTop: 120, width: 300 }}>
          <LearnerLogin />
        </Card>
      </Col>
    </Row>
  );
};
