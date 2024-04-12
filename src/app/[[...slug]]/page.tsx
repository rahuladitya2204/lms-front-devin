import "../../index.css";

import { ClientOnly } from "./client";
import HomePage from "../home/page";
// export function generateStaticParams() {
//   return [];
// }

export default function Page({ params }: { params: { slug: string[] } }) {
  if (!params.slug) {
    return <HomePage />;
  }
  return <ClientOnly />;
}
