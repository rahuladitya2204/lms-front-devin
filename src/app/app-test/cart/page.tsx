import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Enum } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import dynamic from "next/dynamic";
const LearnerCart = dynamic(() => import("@Learner/Screens/LearnerShop/LearnerCartScreen/LearnerCartScreen"), { ssr: false });

export default function Page({ params }: { params: { id: string } }) {
  const {
    getEnrolledProductDetails,
    getOrgDetails,
    getCartDetails,
    getLearnerDetails
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getEnrolledProductDetails(params.id , Enum.ProductType.PACKAGE),
        getOrgDetails(),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <LearnerRootScreen>
        <LearnerCart />
      </LearnerRootScreen>
    </Hydrator>
  );
}
