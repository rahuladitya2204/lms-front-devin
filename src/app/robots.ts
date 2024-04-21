import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // TODO: update this
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.testmint.ai/sitemap.xml",
  };
}
