import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerFullPageHolder from "@Screens/LearnerFullPageHolder";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import dynamic from "next/dynamic";
// import TestPlayer from '@Learner/Screens/Products/Test/TestPlayer/TestPlayer';

const TestPlayer = dynamic(
  () => import("@Learner/Screens/Products/Test/TestPlayer/TestPlayer"),
  { ssr: false }
);

export default function Page({
  params,
  children,
}: {
  params: { testId: string };
  children: React.ReactNode;
}) {
  const {
    // getEnrolledProductList,
    getEnrolledProductDetails,
    getTestDetails,
    getOrgDetails,
    getCartDetails,
    getLearnerDetails,
    getTestResult,
  } = Learner.Queries.Definitions;

  //   const token = getToken();
  return " Hey Man";
}
