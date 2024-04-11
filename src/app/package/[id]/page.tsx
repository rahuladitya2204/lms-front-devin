import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import PackageDetailsTabs from "@Screens/post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailTabs";

import { generateMetadata as GenerateMetadata } from "./[type]/page";

export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { getProductCategoryDetails, getPackages } =
    Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(params.id),
        getPackages(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <PackageDetailsTabs isServer type={"overview"} id={params.id} />
    </Hydrator>
  );
}
