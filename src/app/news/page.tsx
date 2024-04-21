import Hydrator from "@ServerComponents/Hydrator";
import { Learner } from "@adewaskar/lms-common";
import { getToken } from "@Network/index";
import NewsDetailScreen from "@Screens/post-authentication/Learner/Screens/News/NewsDetailScreen";
import LearnerFullPageHolder from "@Screens/LearnerFullPageHolder";
import dayjs from "dayjs";
// import { useSearchParams } from "@Router/index";

// export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  // const searchParams = useSearchParams();
  const { getNewsDetails, getPackages, getLearnerDetails, getPackageDetails } =
    Learner.Queries.Definitions;
  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        // getPackageDetails(params.id),
        getNewsDetails(dayjs().startOf("day").toISOString()),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        ...(token ? [getLearnerDetails()] : []),
      ]}
    >
      <LearnerFullPageHolder isServer>
        <NewsDetailScreen />
      </LearnerFullPageHolder>
      {/* <h1>Hwloi</h1> */}
    </Hydrator>
  );
}
