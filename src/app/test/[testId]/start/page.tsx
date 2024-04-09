import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerFullPageHolder from "@Screens/LearnerFullPageHolder";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import dynamic from "next/dynamic";
import { getToken } from "@Network/index";

const TestRules = dynamic(
  () => import("@Learner/Screens/Products/Test/TestPlayer/TestRules"),
  { ssr: false }
);

export default function Page({ params }: { params: { testId: string } }) {
  const {
    // getEnrolledProductList,
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
        // getOrgDetails(),
        //     // authenticated routes should only be called if token is present
        ...(token
          ? [
              // getCartDetails(),
              // getLearnerDetails(),
              //   getEnrolledProductList( "test"),
              // getTestResult(params.testId),
            ]
          : []),
      ]}
    >
      <LearnerFullPageHolder>
        <TestRules testId={params.testId} />
      </LearnerFullPageHolder>
    </Hydrator>
  );
}
