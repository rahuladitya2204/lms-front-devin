import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { generateMetadata as GenerateMetadata } from "./[type]/page";

export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { getProductCategoryDetails, getPackages, getPYQs, getOrgDetails } =
    Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getOrgDetails(),
        getProductCategoryDetails(params.id),
        getPackages(params.id),
        getPYQs(params.id),
        // // authenticated routes should only be called if token is present
        // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <ProductCategoryTabs
        product="test-series"
        isServer
        type={"overview"}
        id={params.id}
      />
    </Hydrator>
  );
}
