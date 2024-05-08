import "../../index.css";

import { ClientOnly } from "./client";
// import HomePage from "../home/page";
// export function generateStaticParams() {
//   return [];
// }

export default function Page({ params }: { params: { slug: string[] } }) {
  // console.log(params, "params");
  return <ClientOnly />;
}
