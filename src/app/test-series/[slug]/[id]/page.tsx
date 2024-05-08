import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import PackageDetailsTabs from "@Screens/post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailTabs";

import { generateMetadata as GenerateMetadata } from "./[type]/page";
import { getToken } from "@Network/index";

export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const {
    getProductCategoryDetails,
    getPackages,
    getLearnerDetails,
    getPackageDetails,
  } = Learner.Queries.Definitions;
  const token = getToken();
  console.log(params.id, "params.idparams.idparams.idparams.id");
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getPackageDetails(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        ...(token ? [getLearnerDetails()] : []),
      ]}
    >
      <PackageDetailsTabs isServer type={"overview"} id={params.id} />
    </Hydrator>
  );
}
