import dynamic from "next/dynamic";
import "../../index.css";
import HomePage from "../home/page";

// const ClientOnly = dynamic(() => import('./client'), { ssr: false });
import { ClientOnly } from "./client";

export default function Page({ params }: { params: { slug: string[] } }) {
  console.log('Slug page processing', params.slug)
  // console.log(params.slug, "params.slug");
  if (!params.slug) {
    return <HomePage />;
  }
  if (!(params?.slug?.includes('app') || params?.slug?.includes('admin'))) {
    return null;
  }
  // console.log(params, "params");
  return <ClientOnly />;
}
