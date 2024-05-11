import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import { generateMetadata as GenerateMetadata } from "./[id]/[type]/page";
import { getToken } from "@Network/index";
import PageComponent from "./page";
import LearnerRootScreen from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen";
export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
  children,
}: {
  params: { exam: string };
  children?: React.ReactNode;
}) {
  const {
    getProductCategoryDetailsFromExamSlug,
    getPackages,
    getLearnerDetails,
    getPackageDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  console.log(params.exam, "ss;lllll");
  return (
    <Hydrator
      queries={[
        getProductCategoryDetailsFromExamSlug(params.exam),
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
