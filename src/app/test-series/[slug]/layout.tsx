import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import { generateMetadata as GenerateMetadata } from "../../exam/test-series/[id]/[type]/page";
import { getToken } from "@Network/index";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import PageComponent from "./page";
export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
  children,
}: {
  params: { slug: string };
  children?: React.ReactNode;
}) {
  const {
    getProductCategoryDetailsFromTestSeriesSlug,
    getPackages,
    getLearnerDetails,
    getPackageDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  console.log(params.id, "ss;lllll");
  return (
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
        {/* <PageComponent params={params} /> */}
        {children ? children : <PageComponent params={params} />}
      </LearnerRootScreen>
    </Hydrator>
  );
}
