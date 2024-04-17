import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import LearnerTestScreen from "@Learner/Screens/Products/Test/TestScreen/TestsScreen";

import { generateMetadata as GenerateMetadata } from "./[id]/page";
import LearnerBlogsScreen from "@Screens/post-authentication/Learner/Screens/Blog/BlogsScreen";

export const generateMetadata = GenerateMetadata;

export default function Page({ params }: { params: { id: string } }) {
  const {
    // getEnrolledProductList,
    getEnrolledProductDetails,
    getBlogs,
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
        getBlogs(),
        // authenticated routes should only be called if token is present
        ...(token
          ? [
              // getCartDetails(),
              getLearnerDetails(),
            ]
          : []),
      ]}
    >
      {/* <LearnerRootScreen isServer>
        <LearnerBlogsScreen />
      </LearnerRootScreen> */}
    </Hydrator>
  );
}
