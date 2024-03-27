import LearnerHomeScreen from "@Learner/Screens/StoreScreen/HomeScreen";
import Hydrator from "server/components/Hydrator";
import { Learner } from "@adewaskar/lms-common";

export default async function Page() {
  const { getLearnerProductCategories, getRecommendedProducts } =
    Learner.Queries.Definitions;

  return (
    <Hydrator
      queries={[getRecommendedProducts(), getLearnerProductCategories()]}
    >
      <LearnerHomeScreen />
    </Hydrator>
  );
}
