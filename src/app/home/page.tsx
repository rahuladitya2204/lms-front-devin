import LearnerHomeScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/HomeScreen/HomeScreen";
import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import { Suspense } from "react";
import HomeScreenSkeleton from "@Screens/post-authentication/Learner/Screens/StoreScreen/HomeScreen/HomeScreenSkeleton";
import LearnerRootScreenSkeleton from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreenSkeleton";
import Providers from "app/providers";
import { HeadTag } from "./head";

export default function Page() {
  const {
    getLearnerProductCategories,
    getRecommendedProducts,
    getCartDetails,
    getOrgDetails,
    getLearnerDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    <Hydrator
      queries={[
        getRecommendedProducts(),
        getLearnerProductCategories(),
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <HeadTag>
        <LearnerRootScreen isServer>
          <LearnerHomeScreen isServer />
        </LearnerRootScreen>
      </HeadTag>
    </Hydrator>
  );
}
