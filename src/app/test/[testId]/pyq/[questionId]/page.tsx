import Hydrator from "@ServerComponents/Hydrator";
import { Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import TestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";

import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import axios from "axios";
import TestPublicPlayer from "@Screens/post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayer";
import TestPublicPlayerItemReiew from "@Screens/post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayerItem";

export async function generateMetadata(req: {
  params: any;
  searchParams: any;
  headers: Headers;
}): Promise<Metadata> {
  // console.log(req, "reqqq");
  const alias = getCookie("orgAlias")?.split("-")[0];
  const userType = getCookie("userType");
  const id = req.params.testId;
  // console.log(alias, userType, id, "kututurur");
  if (alias && userType) {
    const apiUrl = process.env.API_URL;
    // Fetch metadata from an API
    const { data: test }: { data: Types.Test } = await axios(
      `${apiUrl}/learner/test/${id}?mode=general`,
      {
        headers: {
          "x-org-alias": alias,
        },
      }
    );
    const url = `https://${alias}.testmint.ai/learner/test/${id}`;

    return {
      title: `${test.title} | ${test.subtitle}`,
      description: test.subtitle,
      // icons: {
      //   icon: test.thumbnailImage,
      //   apple: test.thumbnailImage,
      // },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: test.title,
        description: test.subtitle,
        type: "website",
        url: url,
        images: [
          {
            url: test.thumbnailImage,
            width: 800,
            height: 600,
            alt: test.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: test.title,
        description: test.title,
        images: [test.thumbnailImage],
      },
      alternates: {
        canonical: url,
      },
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: test.title,
          description: test.title,
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
  params: { testId: string; questionId: string };
}) {
  const {
    getLearnerProductCategories,
    getEnrolledProductDetails,
    getTestDetails,
    getOrgDetails,
    getCartDetails,
    getLearnerDetails,
    getTestResult,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getOrgDetails(),
        getTestDetails(params.testId),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <TestPublicPlayerItemReiew
        isServer
        testId={params.testId}
        questionId={params.questionId}
      />
    </Hydrator>
  );
}
