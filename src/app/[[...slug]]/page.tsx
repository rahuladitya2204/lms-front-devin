import "../../index.css";
import HomePage from "../home/page";
import { ClientOnly } from "./client";
// import HomePage from "../home/page";
// export function generateStaticParams() {
//   return [];
// }

export default function Page({ params }: { params: { slug: string[] } }) {
  console.log('Slug page processing')
  // console.log(params.slug, "params.slug");
  if (!params.slug) {
    return <HomePage />;
  }
  // console.log(params, "params");
  return <ClientOnly />;
}
