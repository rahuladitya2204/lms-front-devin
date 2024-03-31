import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";

export default function Page({ params }: { params: { id: string } }) {
  const {
    getProductCategoryDetails,
    getPackages,
    getOrgDetails,
    getCartDetails,
    getLearnerDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(params.id),
        getPackages(params.id),
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen>
        <ProductCategoryDetailScreen />
      </LearnerRootScreen>
    </Hydrator>
  );
}
