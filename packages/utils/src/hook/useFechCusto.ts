import { useQuery } from "@tanstack/react-query";
import { fetchCusto } from "../service/FetchCusto";
import type { FetchCusto } from "../types";

export function useFechCusto(custo: FetchCusto) {
  return useQuery({
    queryKey: ["custo", custo],
    queryFn: () => fetchCusto(custo),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
