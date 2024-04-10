import React from "react";
import "../index.css";
import "../App.css";
import Head from "next/head";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import Providers from "./providers";
import axios from "axios";
import { Utils } from "@adewaskar/lms-common";

export const viewport: Viewport = {
  themeColor: "black",
};

export async function generateMetadata(
  req: {
    params: any;
    searchParams: any;
    headers: Headers;
  },
  parent?: () => Promise<Metadata>
): Promise<Metadata> {
  const alias = Utils.Storage.GetItem("orgAlias");
  console.log(alias, "qqqq");
  const apiUrl = process.env.API_URL;
  // Fetch metadata from an API
  const { data: organisation } = await axios(`${apiUrl}/learner/organisation`, {
    headers: {
      "x-org-alias": alias,
    },
  });
  console.log(organisation, "organisation");
  return {
    title: organisation.name,
    description: organisation.description,
    icons: {
      icon: organisation.branding.logo.low.url,
      apple: organisation.branding.logo.low.url,
    },
    manifest: "/manifest.json",
    // Add other metadata properties from the API response
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost&display=swap"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="SUaj-1D8lg5cN2bnBBCXbO_Op5Bfyv49Q7VbpyXH8Fg"
        />
      </Head>
      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-09G526DHYD');
          `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-09G526DHYD"
        strategy="lazyOnload"
      />
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
