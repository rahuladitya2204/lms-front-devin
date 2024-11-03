import Hydrator from "@ServerComponents/Hydrator";
import { Enum, Learner, Types } from "@adewaskar/lms-common";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
const axios = getAxiosInstance();
import { RenderFAQJson } from "@Components/CreateFaqsComponent";

const apiUrl = process.env.API_URL;

export async function generateMetadata(
  req: { params: any; searchParams: any; headers: Headers },
  parent?: () => Promise<Metadata>
): Promise<Metadata> {
  console.log(req, "reqqq");
  const alias = getCookie("orgAlias")?.split("-")[0];
  const userType = getCookie("userType");
  const id = req.params.id;
  const type = req.params.type || "overview";
  if (alias && userType) {
    // Fetch metadata from an API
    const { link, url } = await getData({ id, type });
    return {
      title: link?.seo?.meta?.title || `${link.title} Exam`,
      description: link?.seo?.meta?.description || `${link.title} Exam`,
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: link.title,
        description: link.subtitle,
        type: "website",
        locale: "en_IN",
        url: url,
        images: [
          {
            url: link.thumbnailImage,
            width: 800,
            height: 600,
            alt: link.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: link.title,
        description: link.title,
        images: [link.thumbnailImage],
      },
      alternates: {
        canonical: url,
      }
    };
  }

  return {
    title: "Testmint",
    description: "Testmint",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#ffffff",
    manifest: "/manifest.json",
    openGraph: {
      title: "Testmint",
      description: "Testmint",
      type: "website",
      url: "https://testmint.ai",
      images: [
        {
          url: "/og-image.png",
          width: 800,
          height: 600,
          alt: "Testmint",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Testmint",
      description: "Testmint",
      images: ["/twitter-image.png"],
    },
    alternates: {
      canonical: "https://testmint.ai",
    },
  };
}

export default async function Page({
  params,
}: {
  params: { type: string; id: string; product: string };
}) {
  const { link, url } = await getData(params);

  const {
    getProductCategoryLinkDetails,
    getProductCategoryDetails,
    getOrgDetails,
  } = Learner.Queries.Definitions;
  return (
    <>
      <RenderFAQJson faqs={link?.faqs} />
      <Hydrator
        queries={[
          getOrgDetails(),
          getProductCategoryLinkDetails(params.id, params.type),
          getProductCategoryDetails(params.id)
        ]}
      >
        <ProductCategoryTabs
          url={url}
          product={params.product || "test-series"}
          isServer
          type={params.type || "overview"}
          id={params.id}
        />
      </Hydrator>
    </>
  );
}

export async function getData({ id, type }) {
  const alias = getCookie("orgAlias")?.split("-")[0];
  const url = `https://${alias}.testmint.ai/exam/${id}/${type}`;

  const { data: link }: { data: Types.ProductCategory } = await axios(
    `${apiUrl}/learner/product-category/${id}/${type}`,
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
    link,
    url,
  };
}
