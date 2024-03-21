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
  Navigate,
  Route,
  RouteProps,
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
import LearnerAccount from "@Learner/Screens/Account/Account";
import LearnerCart from "@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen";
import LearnerCourses from "./post-authentication/Learner/Screens/Products/Courses";
import LearnerEditor from "./post-authentication/User/Screens/Users/Learners/LearnersEditor";
import LearnerEventsScreen from "@Learner/Screens/Products/Event/Events/EventScreen";
import LearnerFullPageHolder from "./LearnerFullPageHolder";
import LearnerPrivacyPolicy from "@Learner/Screens/PrivacyPolicy/PrivacyPolicy";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import LearnerStoreScreen from "@Learner/Screens/StoreScreen/StoreScreen";
import LearnerTestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";
import LearnerTestScreen from "@Learner/Screens/Products/Test/TestScreen/TestsScreen";
import LearnerTicketDetail from "@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen";
import LearnerWallet from "@Learner/Screens/Account/LearnerWallet/LearnerWallet";
import LearnersScreen from "./post-authentication/User/Screens/Users/Learners/LearnersScreen";
import LearnersTicketsScreen from "@Learner/Screens/Tickets/TicketsScreen/TicketsScreen";
import MaintainenceScreen from "./MaintainenceScreen/MaintainenceScreen";
import NewsDetailScreen from "@Learner/Screens/News/NewsDetailScreen";
import NewsScreen from "@User/Screens/Admin/News/NewsScreen";
import NotFoundScreen from "./NotFoundScreen/NotFoundScreen";
import OauthRedirect from "@Learner/Screens/OauthRedirect/OauthRedirectScreen";
import OrganisationScreen from "@User/Screens/Admin/Organisations/OrganisationsScreen";
import PackageDetailViewer from "@Learner/Screens/Products/Package/PackageDetailsViewer";
import PackagesScreen from "@User/Screens/Packages/PackagesScreen";
import PaymentSettings from "@User/Screens/Settings/Payments/PaymentSettings";
import PromosScreen from "@User/Screens/Marketing/Promos/PromosScreen";
import ResetPassword from "@Learner/Screens/Login/ResetPassword";
import RootScreen from "./Root";
import SettingsScreen from "@User/Screens/Settings/Settings";
import { Store } from "@adewaskar/lms-common";
import TemplatesScreen from "@User/Screens/Marketing/Templates/TemplatesScreen";
import TestAnswerSheet from "@User/Screens/Tests/TestsList/TestInsights/TestAnswerSheet";
import TestBuilderScreen from "@User/Screens/Tests/TestCreator/TestBuilder/TestBuilder";
import TestCompleted from "@Learner/Screens/Products/Test/TestPlayer/TestCompleted";
import TestEditor from "@User/Screens/Tests/TestCreator";
import TestMetrics from "@Learner/Screens/Products/Test/TestResult/TestMetrics";
import TestPlayer from "@Learner/Screens/Products/Test/TestPlayer/TestPlayer";
import TestPlayerItemReiew from "@Learner/Screens/Products/Test/TestReview/TestPlayerItemReview";
import TestPlayeritem from "@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/TestPlayerItem";
import TestReviewPlayer from "@Learner/Screens/Products/Test/TestReview/TestReviewPlayer";
import TestRules from "@Learner/Screens/Products/Test/TestPlayer/TestRules";
import TestStatus from "@User/Screens/Tests/TestsList/TestInsights/TestStatus";
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
import UserRootScreen from "@User/Screens/UserRoot/UserRootScreen";
import UserTestScreen from "@User/Screens/Tests/TestsList/TestsScreen";
import UserTicketDetail from "@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen";
import UsersScreen from "./post-authentication/User/Screens/Users/Users/UsersScreen";
import UsersTicketsScreen from "@User/Screens/Tickets/TicketsScreen/TicketsScreen";
import WebpageViewer from "@User/Screens/Builder/Website/WebsiteBuilder/WebpageViewer";
import WebsiteBuilderScreen from "@User/Screens/Builder/Website/WebsiteBuilder/WebsiteBuilder";
import WebsiteScreen from "@User/Screens/Builder/Website/Website";
import WhatsappTemplateEditor from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor";
import WhatsappTemplatesScreen from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplatesScreen";
import React from "react";

// const checkDuplicateRouteIds = (
//   element: React.ReactNode,
//   routeIds: Set<string>
// ) => {
//   React.Children.forEach(element, (child) => {
//     if (React.isValidElement(child)) {
//       const { path } = child.props as RouteProps;
//       if (path) {
//         if (routeIds.has(path)) {
//           console.error(`Duplicate route ID found: ${path}`);
//         } else {
//           routeIds.add(path);
//         }
//       }
//       if (child.props.children) {
//         checkDuplicateRouteIds(child.props.children, routeIds);
//       }
//     }
//   });
// };

const router = (userType: string) => {
  const routes = (
    <Route path="/" element={<RootScreen />}>
      <>
        <Route index element={<Navigate to="/app/store" />} />
        <Route path="app" element={<LearnerRootScreen />}>
          <Route path="store" element={<LearnerStoreScreen />} />
        </Route>
      </>
      <Route path="lost" element={<NotFoundScreen />} />
      <Route path="under-maintenance" element={<MaintainenceScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Route>
  );

  // Check for duplicate route IDs
  // const routeIds = new Set<string>();
  // checkDuplicateRouteIds(routes, routeIds);

  return createBrowserRouter(createRoutesFromElements(routes));
};

function AppRouter(): JSX.Element {
  const userType = Store.useAuthentication((s) => s.userType);
  // console.log(userType, 'userType');
  return <RouterProvider router={router(userType)} />;
}

export default AppRouter;
