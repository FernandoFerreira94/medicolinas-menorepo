import { useQuery } from "@tanstack/react-query";
import { FetchLoja } from "../service/FetchLoja";
import { queryKeys } from "../queryKeys";

export function useFetchLoja(loja_id: string) {
  return useQuery({
    queryKey: queryKeys.loja(loja_id),
    queryFn: () => FetchLoja(loja_id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
