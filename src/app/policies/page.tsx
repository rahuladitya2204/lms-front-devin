import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import LearnerPrivacyPolicy from "@Screens/post-authentication/Learner/Screens/ExtraPages/PrivacyPolicy";

export default function Page() {
  // const {
  //   getLearnerProductCategories,
  //   getRecommendedProducts,
  //   getCartDetails,
  //   getOrgDetails,
  //   getLearnerDetails,
  // } = Learner.Queries.Definitions;
  console.log("KYGYGYGYGYG");
  // const token = getToken();
  return (
    <Hydrator>
      <LearnerRootScreen isServer>
        <LearnerPrivacyPolicy />
      </LearnerRootScreen>
    </Hydrator>
  );
}
