import React from "react";
import "../index.css";
import "../App.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import Providers from "./providers";
const axios = getAxiosInstance();
import { Constants, Utils } from "@adewaskar/lms-common";
import { getCookie, getServerCookie } from "@ServerUtils/index";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { initDateFormats } from "@Utils/index";
import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
// initDateFormats();
export const viewport: Viewport = {
  themeColor: "black",
};

export async function generateMetadata(
  req: { params: any; searchParams: any; headers: Headers },
  parent?: () => Promise<Metadata>
): Promise<Metadata> {
  const alias = getCookie("orgAlias")?.split("-")[0];
  const userType = getCookie("userType");
  let organisation = Constants.INITIAL_ORG_DETAILS;
  if (alias && userType) {
    const apiUrl = process.env.API_URL;
    // Fetch metadata from an API
    organisation = (
      await axios(`${apiUrl}/${userType}/organisation`, {
        headers: {
          "x-org-alias": alias,
        },
      })
    ).data;

    const url = `https://${organisation.alias}.testmint.ai`;

    return {
      title: `${organisation.name}${
        organisation.description ? ` | ${organisation.description}` : ""
      }`,
      description: organisation.description,
      icons: {
        icon: organisation.branding.favIcon.url,
        apple: organisation.branding.favIcon.url,
      },
      viewport: "width=device-width, initial-scale=1",
      themeColor: "#ffffff",
      manifest: "/manifest.json",
      openGraph: {
        title: organisation.name,
        description: organisation.description,
        type: "website",
        locale: "en_IN",
        url: url,
        images: [
          {
            url: organisation.branding.logo.low.url,
            width: 800,
            height: 600,
            alt: organisation.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: organisation.name,
        description: organisation.name,
        images: [organisation.branding.logo.low.url],
      },
      alternates: {
        canonical: url,
      },
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: organisation.name,
          description: organisation.name,
          url: url,
        }),
      },
    };
  }

  return {
    title: organisation.name,
    description: organisation.name,
    icons: {
      // icon: organisation.branding.favIcon.url,
      apple: "/apple-touch-icon.png",
    },
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#ffffff",
    manifest: "/manifest.json",
    openGraph: {
      title: organisation.name,
      description: organisation.name,
      type: "website",
      url: `https://${organisation.alias}.testmint.ai`,
      images: [
        {
          url: "/og-image.png",
          width: 800,
          height: 600,
          alt: organisation.name,
        },
      ],
      siteName: organisation.name,
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
    other: JSON.stringify({
      "application/ld+json": {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Testmint",
        description: "Testmint",
        url: "https://testmint.ai",
      },
    }),
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
