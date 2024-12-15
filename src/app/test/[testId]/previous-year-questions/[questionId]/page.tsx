import Hydrator from "@ServerComponents/Hydrator";
import { Constants, Enum, Learner, Types } from "@adewaskar/lms-common";
import LearnerRootScreen from "@Learner/Screens/LearnerRoot/LearnerRootScreen";
import { getToken } from "@Network/index";
import TestDetailScreen from "@Learner/Screens/Products/Test/TestDetail/TestDetail";

import { Metadata } from "next";
import { getCookie } from "@ServerUtils/index";
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
const axios = getAxiosInstance();
import TestPublicPlayerItemReiew from "@Screens/post-authentication/Learner/Screens/Products/Test/PYQPlayer/PYQTestPlayerItem";
import { htmlToText } from "html-to-text";

export async function generateMetadata(req: {
  params: any;
  searchParams: any;
  headers: Headers;
}): Promise<Metadata> {
  // const questionId = req.params.questionId;
  const questionId = getIdFromSlug(req.params.questionId);
  const id = req.params.testId;
  const test = await getTest(id, 'seo');
  // @ts-ignore
  const question: Types.TestQuestion = await getTestQuestion(id, questionId)

  // console.log(req, "reqqq");
  const alias = getCookie("orgAlias")?.split("-")[0];
  const userType = getCookie("userType");
  // console.log(alias, userType, id, "kututurur");
  if (alias && userType) {
    const apiUrl = process.env.NEXT_API_URL;
    const language = test.languages[0];
    const url = `https://${alias}.testmint.ai/test/${id}/previous-year-questions/${questionId}`;
    const questionTitle = htmlToText(question?.title?.text[language]);
    // .slice(0, 70);
    return {
      title: `[Solved] ${questionTitle}`,
      description: test.title,
      // icons: {
      //   icon: test.thumbnailImage,
      //   apple: test.thumbnailImage,
      // },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: `[Solved] ${test.title}`,
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
      locale: "en_IN",
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

export default async function Page({
  params,
}: {
  params: { testId: string; questionId: string };
}) {
  const test = await getTest(params.testId, 'seo');
  const {
    getProductCategoryDetails,
    getTestDetails,
    getCartDetails,
    getLearnerDetails,
    getTexts,
  } = Learner.Queries.Definitions;

  const token = getToken();
  return (
    // @ts-ignore
    <Hydrator
      queries={[
        getProductCategoryDetails(test.category + "", 'basic'),
        getTestDetails(params.testId),
        getTexts(),
        // getPromotedProducts(Enum.ProductType.TEST, {
        //   category: test.category,
        //   limit: 4,
        //   mode: "free",
        // }),
        // authenticated routes should only be called if token is present
        ...(token ? [getCartDetails(), getLearnerDetails()] : []),
      ]}
    >
      <TestPublicPlayerItemReiew
        isServer
        testId={params.testId}
        language={test.languages[0]}
        questionId={params.questionId}
      />
    </Hydrator>
  );
}

export const getIdFromSlug = (slug: string) => {
  return slug?.split(`-`)?.pop();
};

export const getTest = async (
  id: string,
  mode = 'general',
  alias = "www"
): Promise<Types.Test> => {
  const { data: test }: { data: Types.Test } = await axios(
    `learner/test/${id}?mode=${mode}`,
    {
      headers: {
        "x-org-alias": alias,
      },
    }
  );
  return test;
};

export const getTestQuestion = async (
  testId: string,
  questionId: string,
  alias = "www"
): Promise<Types.Test> => {
  const { data: test }: { data: Types.Test } = await axios(
    `learner/test/${testId}/question/${questionId}`,
    {
      headers: {
        "x-org-alias": alias,
      },
    }
  );
  return test;
};
