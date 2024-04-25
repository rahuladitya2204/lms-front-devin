import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen, {
  CategoryProducts,
} from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import axios from "axios";
import GenerateMetada from "./[type]/page";
export const generateMetadata = GenerateMetada;
export default function Page({
  params,
  children,
}: {
  params: { type: string; id: string; product: string };
  children: React.ReactNode;
}) {
  const { getProductCategoryDetails, getPackages, getPYQs } =
    Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(params.id),
        getPackages(params.id),
        getPYQs(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      {/* 123123 */}
      <CategoryProducts
        isServer
        product={params.product}
        type={params.type}
        id={params.id}
      >
        {/* 123123 */}
        {children}
      </CategoryProducts>
    </Hydrator>
  );
}
