import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import dynamic from "next/dynamic";

const LearnerWallet = dynamic(
  () => import("@Learner/Screens/Account/LearnerWallet/LearnerWallet"),
  { ssr: false }
);

export default function Page() {
  const { getCartDetails, getOrgDetails, getLearnerDetails } =
    Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen>
        <LearnerWallet />
      </LearnerRootScreen>
    </Hydrator>
  );
}
