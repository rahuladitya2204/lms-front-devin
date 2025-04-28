import React from "react";
import "../index.css";
import "../App.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import Providers from "./providers";
const axios = getAxiosInstance();
import { Constants } from "@adewaskar/lms-common";
import { getCookie } from "@ServerUtils/index";
Constants.config.API_URL = process.env.NEXT_API_URL || '';

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
    const apiUrl = process.env.NEXT_API_URL;
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
      title: `${organisation.name}${organisation.description ? ` | ${organisation.description}` : ""
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="fast2sms" content="nkRd7PnOUZwUD3o4yKkkERxtVE0QWRgU" />
      <body style={{ margin: 0 }}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {/* Add preload hints for critical resources */}
        <link rel="preconnect" href="https://testmintai-back.azurewebsites.net" />
        <link rel="preconnect" href="https://nimblebee-front-cdn.azureedge.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://testmintai-back.azurewebsites.net" />
        <link rel="dns-prefetch" href="https://nimblebee-front-cdn.azureedge.net" />
        <Providers>{children}</Providers>
        {/* Web Vitals Monitoring */}
        <Script id="web-vitals-reporter" strategy="afterInteractive">
          {`
            function sendToConsole({name, value}) {
              console.log('Web Vitals:', name, value);
            }
            
            try {
              const script = document.createElement('script');
              script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
              script.onload = () => {
                window.webVitals.getCLS(sendToConsole);
                window.webVitals.getFID(sendToConsole);
                window.webVitals.getFCP(sendToConsole);
                window.webVitals.getLCP(sendToConsole);
                window.webVitals.getTTFB(sendToConsole);
              };
              script.onerror = (err) => {
                console.error('Failed to load web-vitals:', err);
              };
              document.head.appendChild(script);
            } catch (err) {
              console.error('Error setting up web-vitals:', err);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
