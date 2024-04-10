"use client";
import { Learner } from "@adewaskar/lms-common";
import Head from "next/head";

interface HeadTagPropsI {
  children?: React.ReactNode;
  id: string;
}

export const HeadTag = (props: HeadTagPropsI) => {
  const { data: bundle } = Learner.Queries.useGetPackageDetails(props.id);
  const { data: organisation } = Learner.Queries
    .useGetOrgDetails
    // props.id
    ();
  const url = `https://${organisation.alias}.testmint.ai/package/${bundle._id}`;
  return (
    <>
      {" "}
      <Head>
        {/* Title */}
        <title>{bundle.subtitle} | Your Platform Name</title>

        {/* Meta Description */}
        <meta
          name="description"
          // content="Prepare for the UPSC exam with our comprehensive mock tests, detailed syllabus, and expert preparation tips. Boost your chances of success with our online test conduction platform."
          content={bundle.description}
        />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={bundle.subtitle} />
        <meta property="og:description" content={bundle.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={bundle.thumbnailImage} />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={bundle.subtitle} />
        <meta name="twitter:description" content={bundle.description} />
        <meta name="twitter:image" content={bundle.thumbnailImage} />

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
       "name": ${bundle.subtitle},
       "description": ${bundle.description},
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
