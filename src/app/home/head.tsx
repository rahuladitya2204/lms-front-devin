"use client";
import { Learner } from "@adewaskar/lms-common";
import Head from "next/head";

interface HeadTagPropsI {
  children?: React.ReactNode;
  // id: string;
}

export const HeadTag = (props: HeadTagPropsI) => {
  const { data: organisation } = Learner.Queries
    .useGetOrgDetails
    // props.id
    ();
  const url = `https://${organisation.alias}.testmint.ai/home`;
  return (
    <>
      <Head>
        {/* Title */}
        <title>{organisation.name}</title>

        {/* Meta Description */}
        <meta
          name="description"
          // content="Prepare for the UPSC exam with our comprehensive mock tests, detailed syllabus, and expert preparation tips. Boost your chances of success with our online test conduction platform."
          content={organisation.name}
        />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={organisation.name} />
        <meta property="og:description" content={organisation.name} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta
          property="og:image"
          content={organisation.branding.logo.low.url}
        />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={organisation.name} />
        <meta name="twitter:description" content={organisation.name} />
        <meta
          name="twitter:image"
          content={organisation.branding.logo.low.url}
        />

        {/* Favicon */}
        <link rel="icon" href={organisation.branding.favIcon.url} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
     {
       "@context": "https://schema.org",
       "@type": "WebPage",
       "name": ${organisation.name},
       "description": ${organisation.name},
       "url": ${url}
     }
   `,
          }}
        />
      </Head>
      {props.children}
    </>
  );
};
