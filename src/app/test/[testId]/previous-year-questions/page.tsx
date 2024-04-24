import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import TestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";

import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import axios from "axios";
import TestPublicPlayer from "@Screens/post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayer";
import TestPublicPlayerItemReiew from "@Screens/post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayerItem";
import { generateMetadata as GenerateMetadata } from "./[questionId]/page";
export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
}: {
  params: { testId: string; questionId: string };
}) {
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
        getOrgDetails(),
        getTestDetails(params.testId),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <TestPublicPlayerItemReiew
        isServer
        testId={params.testId}
        questionId={params.questionId}
      />
    </Hydrator>
  );
}
