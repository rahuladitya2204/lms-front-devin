import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import { generateMetadata as GenerateMetadata } from "./[id]/[type]/page";
import { getToken } from "@Network/index";
import PackagesList from "@Screens/post-authentication/Learner/Screens/Products/Package/PackagesList/PackagesListScreen";
import LearnerRootScreen from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen";

export const generateMetadata = GenerateMetadata;

export default function Page({
  params,
  children,
}: {
  params: { slug: string };
  children?: React.ReactNode;
}) {
  // const {
  //   getProductCategoryDetailsFromTestSeriesSlug,
  //   getPackages,
  //   getLearnerDetails,
  //   getPackageDetails,
  // } = Learner.Queries.Definitions;
  // const token = getToken();
  console.log(params.slug, "ss;lllll");
  return <LearnerRootScreen>{children}</LearnerRootScreen>;
}
