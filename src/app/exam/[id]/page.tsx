import Hydrator from "@ServerComponents/Hydrator";
import { Enum, Learner, Types } from "@adewaskar/lms-common";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { generateMetadata as GenerateMetadata } from "./[type]/page";
import { getCookie } from "@ServerUtils/index";
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
const axios = getAxiosInstance();
import { RenderFAQJson } from "@Components/CreateFaqsComponent";
import { getToken } from "@Network/index";
const apiUrl = process.env.NEXT_API_URL;

export const generateMetadata = GenerateMetadata;

export default async function Page({ params }: { params: { id: string } }) {
  const { category } = await getData({ id: params.id });
  const {
    getProductCategoryDetails,
    getProductCategoryLinkDetails,
    getOrgDetails,
  } = Learner.Queries.Definitions;

  return (
    <>
      {/* @ts-ignore */}
      <Hydrator
        queries={[
          getOrgDetails(),
          getProductCategoryDetails(params.id, 'basic'),
          getProductCategoryLinkDetails(params.id, 'overview')
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
    `learner/product-category/${id}`,
    {
      headers: {
        "x-org-alias": alias,
      },
      params: {
        mode: 'seo'
      }

    }
  );

  return {
    category,
    url,
  };
}
