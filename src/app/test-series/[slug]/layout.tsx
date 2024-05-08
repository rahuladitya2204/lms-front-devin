import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import { generateMetadata as GenerateMetadata } from "./[id]/[type]/page";
import { getToken } from "@Network/index";
import PackagesList from "@Screens/post-authentication/Learner/Screens/Products/Package/PackagesList/PackagesListScreen";
import LearnerRootScreen from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen";

export const generateMetadata = GenerateMetadata;

export default function Page({ params }: { params: { slug: string } }) {
  const {
    getProductCategoryDetailsFromTestSeriesSlug,
    getPackages,
    getLearnerDetails,
    getPackageDetails,
  } = Learner.Queries.Definitions;
  const token = getToken();
  console.log(params.slug, "ss;lllll");
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetailsFromTestSeriesSlug(params.slug),
        // getPackageDetails(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        ...(token ? [getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen isServer>
        <PackagesList isServer slug={params.slug} />
      </LearnerRootScreen>
    </Hydrator>
  );
}
