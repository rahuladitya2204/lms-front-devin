import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { generateMetadata as GenerateMetadata } from "./[type]/page";

export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { getProductCategoryDetails, getPackages, getPYQs } =
    Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(params.id),
        getPackages(params.id),
        getPYQs(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <ProductCategoryTabs isServer type={"overview"} id={params.id} />
    </Hydrator>
  );
}
