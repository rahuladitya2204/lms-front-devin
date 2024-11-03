import LearnerHomeScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/HomeScreen/HomeScreen";
import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";

export default function Page() {
  const {
    getLearnerProductCategories,
    // getRecommendedProducts,
    // getCartDetails,
    getOrgDetails,
    getLearnerDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    <Hydrator
      queries={[
        // getRecommendedProducts(),
        getLearnerProductCategories({ mode: 'basic' }),
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        // ...(token ? [getLearnerDetails()] : []),
        // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen isServer>
        <LearnerHomeScreen isServer />
      </LearnerRootScreen>
    </Hydrator>
  );
}
