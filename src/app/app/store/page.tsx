import LearnerHomeScreen from "@Learner/Screens/StoreScreen/HomeScreen";
import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";

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
    // @ts-ignore
    <Hydrator
      queries={[
        getRecommendedProducts(),
        getLearnerProductCategories(),
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
        <LearnerRootScreen>
          <LearnerHomeScreen />
        </LearnerRootScreen>
    </Hydrator>
  );
}
