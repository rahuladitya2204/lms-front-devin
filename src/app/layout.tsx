import React from "react";
import "../index.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = {
  title: "NimbleBee",
  description: "NimbleBee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <meta
          name="google-site-verification"
          content="SUaj-1D8lg5cN2bnBBCXbO_Op5Bfyv49Q7VbpyXH8Fg"
        />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Providers>{children}</Providers>
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-09G526DHYD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-09G526DHYD');
          `}
      </Script>
    </html>
  );
}
