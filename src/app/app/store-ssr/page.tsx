import LearnerHomeScreen from "@Learner/Screens/StoreScreen/HomeScreen";
import Hydrator, { prefetchMutations } from "server/components/Hydrator";
import { headers } from "next/headers";
import { getSubdomainFromHost } from "@Utils/index";

import { Common, Learner } from "@adewaskar/lms-common";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const subdomain = getSubdomainFromHost(headers().get("host"));
  console.log("subdomain", subdomain);
  const { validateOrgAlias } = Common.Queries.Definitions;
  const { getLearnerProductCategories, getRecommendedProducts } =
    Learner.Queries.Definitions;

  await prefetchMutations([validateOrgAlias(subdomain ?? "")]);

  return (
    <Hydrator
      queries={[getRecommendedProducts(), getLearnerProductCategories()]}
    >
      <LearnerHomeScreen />
    </Hydrator>
  );
}
