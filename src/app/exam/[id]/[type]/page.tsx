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
    const { category, link, url } = await getData({ id, type });
    return {
      title: link?.seo?.meta?.title || `${category.title} Exam`,
      description: link?.seo?.meta?.description || `${category.title} Exam`,
      // icons: {
      //   icon: category.thumbnailImage,
      //   apple: category.thumbnailImage,
      // },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: category.title,
        description: category.subtitle,
        type: "website",
        locale: "en_IN",
        url: url,
        images: [
          {
            url: category.thumbnailImage,
            width: 800,
            height: 600,
            alt: category.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: category.title,
        description: category.title,
        images: [category.thumbnailImage],
      },
      alternates: {
        canonical: url,
      },
      // other: {
      //   "application/ld+json": JSON.stringify({
      //     "@context": "https://schema.org",
      //     "@type": "WebPage",
      //     name: category.title,
      //     description: category.title,
      //     url: url,
      //   }),
      //   // "schema:faq": JSON.stringify(faqSchema),
      // },
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
  const { category, link, url } = await getData(params);
  console.log(link, "link");
  const {
    getProductCategoryDetails,
    getPackages,
    getPYQs,
    getPromotedProducts,
  } = Learner.Queries.Definitions;
  const keywords = link?.keywords || category.keywords;
  return (
    <>
      <RenderFAQJson faqs={link?.faqs} />
      <Hydrator
        queries={[
          getProductCategoryDetails(params.id),
          // getPackages(params.id),
          getPYQs(params.id),
          getPromotedProducts(Enum.ProductType.PACKAGE, {
            category: params.id,
            ...(keywords?.length ? { keywords: keywords } : {}),
            limit: 3,
          }),
          getPromotedProducts(Enum.ProductType.TEST, {
            category: params.id,
            mode: "free",
            ...(keywords?.length ? { keywords: keywords } : {}),
            limit: 3,
          }),
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

  const { data: category }: { data: Types.ProductCategory } = await axios(
    `${apiUrl}/learner/product-category/${id}`,
    {
      headers: {
        "x-org-alias": alias,
      },
    }
  );
  const link =
    type === "overview"
      ? { seo: category.seo, faqs: category.info.faqs }
      : type === "test-series"
      ? category.testSeries
      : category.info.links.find((link) => link.slug === type);
  return {
    category,
    link,
    url,
  };
}
