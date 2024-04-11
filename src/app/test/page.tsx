import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import LearnerTestScreen from "@Learner/Screens/Products/Test/TestScreen/TestsScreen";

import { generateMetadata as GenerateMetadata } from "./[testId]/page";

export const generateMetadata = GenerateMetadata;

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
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token
          ? [
              getCartDetails(),
              getLearnerDetails(),
              //   getEnrolledProductList( "test"),
              getTestResult(params.testId),
            ]
          : []),
      ]}
    >
      <LearnerRootScreen isServer>
        <LearnerTestScreen />
      </LearnerRootScreen>
    </Hydrator>
  );
}
