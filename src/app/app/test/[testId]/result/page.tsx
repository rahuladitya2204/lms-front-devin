import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerFullPageHolder from "@Screens/LearnerFullPageHolder";

import dynamic from "next/dynamic";

const TestMetrics = dynamic(
  () => import("@Learner/Screens/Products/Test/TestResult/TestMetrics"),
  { ssr: false }
);

export default function Page({
  params,
}: {
  params: { testId: string; questionId: string };
}) {
  const { getOrgDetails, getLearnerDetails } = Learner.Queries.Definitions;
  console.log(params, "questionIdquestionId");
  return (
    <Hydrator
      queries={[
        getOrgDetails(),
        getLearnerDetails(),
        //     // authenticated routes should only be called if token is present
        //     ...(token
        //       ? [
        //           getCartDetails(),
        //           getLearnerDetails(),
        //         //   getEnrolledProductList( "test"),
        //           getTestResult(params.testId),
        //         ]
        //       : []),
      ]}
    >
      <LearnerFullPageHolder>
        {/* @ts-ignore */}
        <TestMetrics testId={params.testId} />
      </LearnerFullPageHolder>
    </Hydrator>
  );
}
