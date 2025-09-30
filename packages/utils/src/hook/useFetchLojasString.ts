import { useQuery } from "@tanstack/react-query";
import { fetchLojasString } from "../service/fetchLojasString";
import { queryKeys } from "../queryKeys";

export function useFetchLojasString(searchQuery: string | null = null) {
  return useQuery({
    queryKey: queryKeys.lojas(searchQuery),
    queryFn: () => fetchLojasString(searchQuery),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
