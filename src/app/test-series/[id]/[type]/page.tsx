import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import ProductCategoryDetailScreen from "@Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import { getToken } from "@Network/index";
import ProductCategoryTabs from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import PackageDetailsTabs from "@Screens/post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailTabs";
import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import axios from "axios";

export async function generateMetadata(req: {
  params: any;
  searchParams: any;
  headers: Headers;
}): Promise<Metadata> {
  console.log(req, "reqqq");
  const alias = getCookie("orgAlias")?.split("-")[0];
  const userType = getCookie("userType");
  const id = req.params.id;
  const type = req.params.type || "overview";
  // console.log(alias, userType, id, "kututurur");
  if (alias && userType && id) {
    const apiUrl = process.env.API_URL;
    // Fetch metadata from an API
    const { data: bundle }: { data: Types.Package } = await axios(
      `${apiUrl}/learner/package/${id}`,
      {
        headers: {
          "x-org-alias": alias,
        },
      }
    );
    // const { data: category }: { data: Types.ProductCategory } = await axios(
    //   `${apiUrl}/learner/product-category/${bundle.category._id}`,
    //   {
    //     headers: {
    //       "x-org-alias": alias,
    //     },
    //   }
    // );
    const url = `https://${alias}.testmint.ai/test-series/${id}/${type}`;
    console.log(bundle, "bundle?.seo");
    return {
      title: bundle?.seo?.meta?.title || `${bundle.title}`,
      description: bundle?.seo?.meta?.description || `${bundle.title}`,
      // icons: {
      //   icon: bundle.thumbnailImage,
      //   apple: bundle.thumbnailImage,
      // },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: bundle.title,
        description: bundle.subtitle,
        type: "website",
        locale: "en_IN",
        url: url,
        images: [
          {
            url: bundle.thumbnailImage,
            width: 800,
            height: 600,
            alt: bundle.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: bundle.title,
        description: bundle.title,
        images: [bundle.thumbnailImage],
      },
      alternates: {
        canonical: url,
      },
      other: {
        // "application/ld+json": JSON.stringify({
        //   "@context": "https://schema.org",
        //   "@type": "WebPage",
        //   name: bundle.title,
        //   description: bundle.title,
        //   url: url,
        // }),
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
  params: { type: string; id: string };
}) {
  const token = getToken();
  const { getPackageDetails, getLearnerDetails } = Learner.Queries.Definitions;
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getPackageDetails(params.id),
        // getPackages(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        ...(token ? [getLearnerDetails()] : []),
      ]}
    >
      <PackageDetailsTabs isServer type={params.type} id={params.id} />
    </Hydrator>
  );
}
