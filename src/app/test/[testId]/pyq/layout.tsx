import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import TestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";

import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import axios from "axios";
import PYQTestPlayer from "@Screens/post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayer";
import LearnerFullPageHolder from "@Screens/LearnerFullPageHolder";
import { generateMetadata as GenerateMetadata } from "./[questionId]/page";
export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
  children,
}: {
  params: { testId: string };
  children: React.ReactNode;
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
        getTestDetails(params.testId, "result"),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerFullPageHolder noSignIn>
        <PYQTestPlayer isServer children={children} />
      </LearnerFullPageHolder>
    </Hydrator>
  );
}
