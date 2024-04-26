import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import axios from "axios";

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
    const apiUrl = process.env.API_URL;
    // Fetch metadata from an API
    const { data: category }: { data: Types.ProductCategory } = await axios(
      `${apiUrl}/learner/product-category/${id}`,
      {
        headers: {
          "x-org-alias": alias,
        },
      }
    );

    const url = `https://${alias}.testmint.ai/exam/${id}/${type}`;

    return {
      title: `${category.title} | ${category.subtitle}`,
      description: category.subtitle,
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
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: category.title,
          description: category.title,
          url: url,
        }),
      },
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
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Testmint",
        description: "Testmint",
        url: "https://testmint.ai",
      }),
    },
  };
}

export default function Page({
  params,
}: {
  params: { type: string; id: string; product: string };
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
      <ProductCategoryTabs
        product={params.product || "test-series"}
        isServer
        type={params.type || "overview"}
        id={params.id}
      />
    </Hydrator>
  );
}
