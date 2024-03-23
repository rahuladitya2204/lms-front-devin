import "../../index.css";
import { ClientOnly } from "./client";

export function generateStaticParams() {
<<<<<<< Updated upstream
  return [{ slug: ["store"] }];
=======
  return [{ slug: ["hello-world"] }];
>>>>>>> Stashed changes
}

export default function Page({ params }: { params: { slug: string[] } }) {
  return <ClientOnly />;
}
