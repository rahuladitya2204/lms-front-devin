import {
  dehydrate,
  FetchQueryOptions,
  Hydrate,
  QueryClient,
} from "@tanstack/react-query";
import getQueryClient from "../utils/getQueryClient";
import { initInterceptors } from "@Network/index";

type Queries = Array<FetchQueryOptions>;

async function prefetchQueries(queryClient: QueryClient, queries: Queries) {
  const promises = queries.map((query) => queryClient.prefetchQuery(query));
  const results = await Promise.all(promises);
  return results;
}

export interface HydratorProps {
  children: React.ReactNode;
  queries: Queries;
}

export default async function Hydrator({ children, queries }: HydratorProps) {
  initInterceptors();
  const queryClient = getQueryClient();
  await prefetchQueries(queryClient, queries);
  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
