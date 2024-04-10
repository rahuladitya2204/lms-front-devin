"use client";
import { Learner } from "@adewaskar/lms-common";
import Head from "next/head";

interface HeadTagPropsI {
  children?: React.ReactNode;
  id: string;
}

export const HeadTag = (props: HeadTagPropsI) => {
  const { data: category } = Learner.Queries.useGetProductCategoryDetails(
    props.id
  );
  const { data: organisation } = Learner.Queries
    .useGetOrgDetails
    // props.id
    ();
  const url = `https://${organisation.alias}.testmint.ai/category/${category._id}`;
  return (
    <>
      {" "}
      <Head>
        {/* Title */}
        <title>{category.subtitle} | Your Platform Name</title>

        {/* Meta Description */}
        <meta
          name="description"
          // content="Prepare for the UPSC exam with our comprehensive mock tests, detailed syllabus, and expert preparation tips. Boost your chances of success with our online test conduction platform."
          content={category.description}
        />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={category.subtitle} />
        <meta property="og:description" content={category.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={category.thumbnailImage} />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={category.subtitle} />
        <meta name="twitter:description" content={category.description} />
        <meta name="twitter:image" content={category.thumbnailImage} />

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
       "name": ${category.subtitle},
       "description": ${category.description},
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
