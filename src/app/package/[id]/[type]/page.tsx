import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import PackageDetailsTabs from "@Screens/post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailTabs";

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { getPackageDetails } = Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getPackageDetails(params.id),
        // getPackages(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <PackageDetailsTabs isServer type={params.type} id={params.id} />
    </Hydrator>
  );
}
