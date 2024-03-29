import {
  dehydrate,
  FetchQueryOptions,
  Hydrate,
  QueryClient,
} from "@tanstack/react-query";
import getQueryClient from "../utils/getQueryClient";
import { initializeApp } from "@Utils/index";

type Queries = Array<FetchQueryOptions>;
type Mutations = Array<Promise<any>>;

export async function prefetchQueries(
  queryClient: QueryClient,
  queries: Queries
) {
  const promises = queries.map((query) => queryClient.prefetchQuery(query));
  const results = await Promise.all(promises);
  return results;
}

export async function prefetchMutations(mutations: Mutations) {
  const results = await Promise.all(mutations);
  return results;
}

export interface HydratorProps {
  children: React.ReactNode;
  queries?: Queries;
}

export default async function Hydrator({ children, queries }: HydratorProps) {
  // initialize application utils like interceptors and storage on server side  initInterceptors();
  initializeApp();

  const queryClient = getQueryClient();
  if (queries && queries.length) {
    await prefetchQueries(queryClient, queries);
  }

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
