import React from "react";
import "../index.css";
import "../App.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import Providers from "./providers";
import axios from "axios";
import { Utils } from "@adewaskar/lms-common";
import { getCookie, getServerCookie } from "@ServerUtils/index";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { initDateFormats } from "@Utils/index";
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

  if (alias && userType) {
    const apiUrl = process.env.API_URL;
    // Fetch metadata from an API
    const { data: organisation } = await axios(
      `${apiUrl}/${userType}/organisation`,
      {
        headers: {
          "x-org-alias": alias,
        },
      }
    );

    const url = `https://${organisation.alias}.testmint.ai/home`;

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
      <Script
        id="google-analytics"
        //  strategy="lazyOnload"
      >
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-09G526DHYD');
          `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-09G526DHYD"
        // strategy="lazyOnload"
      />
      <body style={{ margin: 0 }}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
