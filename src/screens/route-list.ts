import { lazy } from 'react'

export const AddPromo = lazy(() =>
  import('@User/Screens/Marketing/Promos/CreatePromo')
)
export const AddQuestion = lazy(() =>
  import('@User/Screens/Tests/TestCreator/TestBuilder/AddQuestionItem')
)
export const AddTextItem = lazy(() =>
  import('@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/AddTextItem/AddTextItem')
)
export const AppBuilderScreen = lazy(() =>
  import('@User/Screens/Builder/AppBuilder/AppBuilderScreen')
)
export const AssetLibraryScreen = lazy(() =>
  import('@User/Screens/AssetLibrary/AssetLibrary')
)
export const CampaignScreen = lazy(() =>
  import('@User/Screens/Marketing/CampaignScreen/CampaignScreen')
)
export const CertificateTemplateEditor = lazy(() =>
  import('@User/Screens/CertificateTemplates/CertificateTemplateEditor')
)
export const CourseAnalytics = lazy(() =>
  import('@User/Screens/Courses/CourseAnalytics/CourseAnalytics')
)
export const CourseBuilderScreen = lazy(() =>
  import('@User/Screens/Courses/CourseEditor/CourseBuilder/CourseBuilderScreen')
)
export const CourseDetailViewer = lazy(() =>
  import('./post-authentication/Learner/Screens/Products/Courses/CourseDetailsViewer')
)
export const CourseEditor = lazy(() =>
  import('./post-authentication/User/Screens/Courses/CourseEditor')
)
export const CourseInformationEditor = lazy(() =>
  import('@User/Screens/Courses/CourseEditor/CourseInformation')
)
export const CoursePlayer = lazy(() =>
  import('./post-authentication/Learner/Screens/CoursePlayer')
)
export const CoursePlayerItem = lazy(() =>
  import('./post-authentication/Learner/Screens/CoursePlayer/CoursePlayerItem')
)
export const CoursesScreen = lazy(() =>
  import('./post-authentication/User/Screens/Courses/CoursesScreen')
)
export const CreateCampaign = lazy(() =>
  import('@User/Screens/Marketing/CampaignScreen/CreateCampaign/CreateCampaign')
)
export const CreateEvent = lazy(() =>
  import('@User/Screens/Event/CreateEvent/CreateEvent')
)
export const CreatePackage = lazy(() =>
  import('@User/Screens/Packages/CreatePackage/CreatePackage')
)
export const CreateQuizForm = lazy(() =>
  import('@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/CreateQuizForm/CreateQuizForm')
)
export const CreateTest = lazy(() => import('@User/Screens/Tests/CreateTest'))
export const EmailTemplateEditor = lazy(() =>
  import('@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor')
)
export const EmailTemplatesScreen = lazy(() =>
  import('@User/Screens/CertificateTemplates/CertificateTemplatesScreen')
)
export const EnrolledCourseDetailScreen = lazy(() =>
  import('@Learner/Screens/EnrolledCourseDetail/EnrolledCourseDetailScreen')
)
export const EnrolledCourseSuccessful = lazy(() =>
  import('@Learner/Screens/LearnerShop/EnrolledCourse/EnrolledCourseSuccessful')
)
export const UserEditor = lazy(() =>
  import('./post-authentication/User/Screens/Users/Users/UserEditor')
)
export const UsersScreen = lazy(() =>
  import('./post-authentication/User/Screens/Users/Users/UsersScreen')
)
export const LearnerAccount = lazy(() =>
  import('@Learner/Screens/Account/Account')
)
export const LearnerCart = lazy(() =>
  import('@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen')
)
export const LearnerCourses = lazy(() =>
  import('./post-authentication/Learner/Screens/Products/Courses')
)

export const LearnerEditor = lazy(() =>
  import('./post-authentication/User/Screens/Users/Learners/LearnersEditor')
)

export const LearnerEventsScreen = lazy(() =>
  import('@Learner/Screens/Products/Event/Events/EventScreen')
)
export const LearnerRootScreen = lazy(() =>
  import('./post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen')
)
export const LearnerStoreScreen = lazy(() =>
  import('@Learner/Screens/StoreScreen/StoreScreen')
)
export const LearnerTestDetailScreen = lazy(() =>
  import('@Learner/Screens/Products/Test/TestDetail/TestDetail')
)
export const LearnerTestResult = lazy(() =>
  import('@Learner/Screens/Products/Test/TestResult/TestResult')
)
export const LearnerTestScreen = lazy(() =>
  import('@Learner/Screens/Products/Test/TestScreen/TestsScreen')
)
export const LearnerTicketDetail = lazy(() =>
  import('@Learner/Screens/Tickets/TicketDetailScreen/TicketDetailScreen')
)
export const LearnersScreen = lazy(() =>
  import('./post-authentication/User/Screens/Users/Learners/LearnersScreen')
)
export const LearnersTicketsScreen = lazy(() =>
  import('@Learner/Screens/Tickets/TicketsScreen/TicketsScreen')
)
export const EventDetailScreen = lazy(() =>
  import('@Learner/Screens/Products/Event/EventDetail')
)
export const NotFoundScreen = lazy(() =>
  import('./NotFoundScreen/NotFoundScreen')
)
export const OauthRedirect = lazy(() =>
  import('@Learner/Screens/OauthRedirect/OauthRedirectScreen')
)
export const PackagesScreen = lazy(() =>
  import('@User/Screens/Packages/PackagesScreen')
)
export const PaymentSettings = lazy(() =>
  import('@User/Screens/Settings/Payments/PaymentSettings')
)
// export const ProductCategoryScreen = lazy(() =>
//   import('@User/Screens/Categories/ProductCategory/ProductCategoryScreen')
// )
export const PromosScreen = lazy(() =>
  import('@User/Screens/Marketing/Promos/PromosScreen')
)
export const RootScreen = lazy(() => import('./Root'))
export const SettingsScreen = lazy(() =>
  import('@User/Screens/Settings/Settings')
)
export const TemplatesScreen = lazy(() =>
  import('@User/Screens/Marketing/Templates/TemplatesScreen')
)
export const TestBuilderScreen = lazy(() =>
  import('@User/Screens/Tests/TestCreator/TestBuilder/TestBuilder')
)
export const TestCompleted = lazy(() =>
  import('@Learner/Screens/Products/Test/TestPlayer/TestCompleted')
)
export const TestEditor = lazy(() => import('@User/Screens/Tests/TestCreator'))
export const TestPlayer = lazy(() =>
  import('@Learner/Screens/Products/Test/TestPlayer/TestPlayer')
)
export const TestPlayeritem = lazy(() =>
  import('@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/TestPlayerItem')
)
export const TestRules = lazy(() =>
  import('@Learner/Screens/Products/Test/TestPlayer/TestRules')
)
export const TestStatus = lazy(() =>
  import('@User/Screens/Tests/TestsList/TestInsights/TestStatus')
)
export const UploadPDFForm = lazy(() =>
  import('@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadPDF/UploadPDFForm')
)
export const UploadVideoForm = lazy(() =>
  import('@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoForm')
)
export const UserAccount = lazy(() =>
  import('@User/Screens/Settings/Account/Account')
)
export const UserDashboard = lazy(() =>
  import('@User/Screens/UserDashboard/UserDashboard')
)

export const UserLoginScreen = lazy(() =>
  import('./post-authentication/User/Screens/Login')
)

export const UserRootScreen = lazy(() =>
  import('./post-authentication/User/Screens/UserRoot/UserRootScreen')
)
export const UserTestScreen = lazy(() =>
  import('@User/Screens/Tests/TestsList/TestsScreen')
)
export const UserTicketDetail = lazy(() =>
  import('@User/Screens/Tickets/TicketDetailScreen/TicketDetailScreen')
)
export const UsersTicketsScreen = lazy(() =>
  import('@User/Screens/Tickets/TicketsScreen/TicketsScreen')
)
// export const WebpageViewer = lazy(() =>
//   import('@User/Screens/Builder/Website/WebsiteBuilder/WebpageViewer')
// )
// export const WebsiteBuilderScreen = lazy(() =>
//   import('@User/Screens/Builder/Website/WebsiteBuilder/WebsiteBuilder')
// )
// export const WebsiteScreen = lazy(() =>
//   import('@User/Screens/Builder/Website/Website')
// )
export const WhatsappTemplateEditor = lazy(() =>
  import('@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor')
)
export const WhatsappTemplatesScreen = lazy(() =>
  import('@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplatesScreen')
)
export const EventsScreen = lazy(() =>
  import('@User/Screens/Event/EventScreen/Events')
)
export const TestResultTable = lazy(() =>
  import('@Learner/Screens/Products/Test/TestResult/Table/TestResultTable')
)
export const ResetPassword = lazy(() =>
  import('@Learner/Screens/Login/ResetPassword')
)
// Assuming `LoadingScreen` is a component that might be used as a fallback for lazy loading.
export const LoadingScreen = lazy(() => import('@Components/LoadingScreen'))
