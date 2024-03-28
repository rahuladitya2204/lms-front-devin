import LearnerHomeScreen from "@Learner/Screens/StoreScreen/HomeScreen";
import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";

export default function Page() {
  const {
    getLearnerProductCategories,
    getRecommendedProducts,
    getCartDetails,
    getOrgDetails,
    getLearnerDetails,
  } = Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getRecommendedProducts(),
        getLearnerProductCategories(),
        getCartDetails(),
        getOrgDetails(),
        getLearnerDetails(),
      ]}
    >
      <LearnerRootScreen>
        <LearnerHomeScreen />
      </LearnerRootScreen>
    </Hydrator>
  );
}
