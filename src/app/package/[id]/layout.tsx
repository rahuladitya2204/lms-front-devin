import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import PackageDetailViewer from "@Learner/Screens/Products/Package/PackageDetailsViewer";

export default function Page({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const {
    getPackageDetails,
    getOrgDetails,
    getCartDetails,
    getLearnerDetails,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getPackageDetails(params.id),
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen isServer>
        <PackageDetailViewer children={children} isServer />
      </LearnerRootScreen>
    </Hydrator>
  );
}
