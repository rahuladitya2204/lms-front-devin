import Hydrator from "@ServerComponents/Hydrator";
import { Enum, Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";

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
    getPYQs,
    getOrgDetails,
    getCartDetails,
    getPromotedProducts,
    getLearnerDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(params.id),
        getPackages(params.id),
        getPYQs(params.id),
        getOrgDetails(),
        getPromotedProducts(Enum.ProductType.PACKAGE, {
          category: params.id,
        }),
        getPromotedProducts(Enum.ProductType.TEST, {
          category: params.id,
          mode: "free",
        }),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen isServer>
        <ProductCategoryDetailScreen
          product="test-series"
          children={children}
          isServer
        />
      </LearnerRootScreen>
    </Hydrator>
  );
}
