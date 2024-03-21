import "../../index.css";
import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [{ slug: ["store"] }];
}

export default function Page({ params }: { params: { slug: string[] } }) {
  return <ClientOnly />;
}
