import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";
import { HeadTag } from "./head";

export default function Page({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
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
      <HeadTag id={params.id}>
        <LearnerRootScreen isServer>
          <ProductCategoryDetailScreen children={children} isServer />
        </LearnerRootScreen>
      </HeadTag>
    </Hydrator>
  );
}
