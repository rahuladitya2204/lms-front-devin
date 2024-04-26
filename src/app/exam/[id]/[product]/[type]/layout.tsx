export default function Page({
  params,
  children,
}: {
  params: { type: string; id: string; product: string };
  children: React.ReactNode;
}) {
  return children;
}
