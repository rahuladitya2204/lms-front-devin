import LearnerHomeScreen from "@Learner/Screens/StoreScreen/HomeScreen";
import { Network } from "@adewaskar/lms-common";
import Hydrator from "server/components/Hydrator";

export const getRecommendedProducts = () => {
  return Network.Axios.get(`learner/organisation/product/recommended`, {}).then(
    (r) => r.data
  );
};

export default function Page({ params }: { params: { slug: string[] } }) {
  return (
    <Hydrator
      queries={[
        {
          queryKey: ["GET_RECOMMENDED_PRODUCTS", undefined],
          queryFn: () => getRecommendedProducts(),
        },
      ]}
    >
      <LearnerHomeScreen></LearnerHomeScreen>
    </Hydrator>
  );
}
