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
    getProductCategoryLinkDetails,
    getOrgDetails,

  } = Learner.Queries.Definitions;

  // const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(params.id),
        getProductCategoryLinkDetails(params.id, 'overview'),
        getOrgDetails(),
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
