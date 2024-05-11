import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import PackageDetailsTabs from "@Screens/post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailTabs";

import { getToken } from "@Network/index";
import PackagesList from "@Screens/post-authentication/Learner/Screens/Products/Package/PackagesList/PackagesListScreen";
import axios from "axios";
import { getCookie } from "@ServerUtils/index";
import { Metadata } from "next";
import PackagesExamScreen from "@Screens/post-authentication/Learner/Screens/Products/Package/PackagesList/PackagesExamScreen";

export async function generateMetadata(req: {
  params: any;
  searchParams: any;
  headers: Headers;
}): Promise<Metadata> {
  console.log(req, "reqqq");
  const alias = getCookie("orgAlias")?.split("-")[0];
  const userType = getCookie("userType");
  const examSlug = req.params.exam;
  console.log(examSlug, "slug");
  if (alias && userType && examSlug) {
    const apiUrl = process.env.API_URL;
    const { data: category }: { data: Types.ProductCategory } = await axios(
      `${apiUrl}/learner/product-category/exam/slug/${examSlug}`,
      {
        headers: {
          "x-org-alias": alias,
        },
      }
    );
    const url = `https://${alias}.testmint.ai/test-series/${examSlug}`;
    const exam = category.exams.find((i) => i.page.slug === examSlug);
    console.log(exam, examSlug, "examkmkm");
    return {
      title: exam?.seo?.meta?.title,
      description: exam?.seo?.meta?.description,
      // icons: {
      //   icon: bundle.thumbnailImage,
      //   apple: bundle.thumbnailImage,
      // },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: exam?.seo?.meta?.title,
        description: exam?.seo?.meta?.description,
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

export default function Page({ params }: { params: { exam: string } }) {
  const {
    getProductCategoryDetailsFromExamSlug,
    getPackages,
    getLearnerDetails,
    getPackageDetails,
  } = Learner.Queries.Definitions;
  const token = getToken();
  console.log(params, "kuturi");
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetailsFromExamSlug(params.exam),
        // getPackageDetails(params.id),
        // getOrgDetails(),
        // // authenticated routes should only be called if token is present
        ...(token ? [getLearnerDetails()] : []),
      ]}
    >
      <PackagesExamScreen isServer exam={params.exam} />
    </Hydrator>
  );
}
