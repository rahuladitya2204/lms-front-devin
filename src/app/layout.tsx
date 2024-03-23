import React from "react";
import "../index.css";

import type { Metadata, Viewport } from "next";

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
    // <QueryProvider>
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
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
    // </QueryProvider>
  );
}
