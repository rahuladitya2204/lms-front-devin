import Hydrator from "@ServerComponents/Hydrator";
import { Enum, Learner, Types } from "@adewaskar/lms-common";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { generateMetadata as GenerateMetadata } from "./[type]/page";
import { getCookie } from "@ServerUtils/index";
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
const axios = getAxiosInstance();
import { RenderFAQJson } from "@Components/CreateFaqsComponent";
const apiUrl = process.env.API_URL;

export const generateMetadata = GenerateMetadata;

export default async function Page({ params }: { params: { id: string } }) {
  const { category } = await getData({ id: params.id });
  const {
    getProductCategoryDetails,
    getPackages,
    getPYQs,
    getOrgDetails,
    getPromotedProducts,
  } = Learner.Queries.Definitions;
  return (
    <>
      <RenderFAQJson faqs={category.info.faqs} />
      {/* @ts-ignore */}
      <Hydrator
        queries={[
          // getOrgDetails(),
          getProductCategoryDetails(params.id),
          // getPackages(params.id),
          // getPromotedProducts(Enum.ProductType.PACKAGE, {
          //   category: params.id,
          //   limit: 3,
          //   ...(category.keywords?.length
          //     ? { keywords: category.keywords }
          //     : {}),
          // }),
          // getPromotedProducts(Enum.ProductType.TEST, {
          //   category: params.id,
          //   mode: "free",
          //   limit: 3,
          //   ...(category.keywords?.length
          //     ? { keywords: category.keywords }
          //     : {}),
          // }),
          // // authenticated routes should only be called if token is present
          // ...(token ? [getCartDetails(), getLearnerDetails()] : []),
        ]}
      >
        <ProductCategoryTabs
          product="test-series"
          isServer
          type={"overview"}
          id={params.id}
        />
      </Hydrator>
    </>
  );
}

export async function getData({ id }) {
  const alias = getCookie("orgAlias")?.split("-")[0];
  const url = `https://${alias}.testmint.ai/exam/${id}`;

  const { data: category }: { data: Types.ProductCategory } = await axios(
    `${apiUrl}/learner/product-category/${id}`,
    {
      headers: {
        "x-org-alias": alias,
      },
    }
  );

  return {
    category,
    url,
  };
}
