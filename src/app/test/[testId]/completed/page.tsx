import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import TestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";
import dynamic from "next/dynamic";

const TestCompleted = dynamic(
  () => import("@Learner/Screens/Products/Test/TestPlayer/TestCompleted"),
  { ssr: false }
);

export default function Page({ params }: { params: { testId: string } }) {
  const {
    getLearnerProductCategories,
    getEnrolledProductDetails,
    getTestDetails,
    getOrgDetails,
    getCartDetails,
    getLearnerDetails,
    getTestResult,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getLearnerProductCategories(),
        getOrgDetails(),
        getTestDetails(params.testId),
        // authenticated routes should only be called if token is present
        ...(token
          ? [
              getCartDetails(),
              getLearnerDetails(),
              getEnrolledProductDetails(params.testId, "test"),
              getTestResult(params.testId),
            ]
          : []),
      ]}
    >
      <LearnerRootScreen>
        <TestCompleted />
      </LearnerRootScreen>
    </Hydrator>
  );
}
