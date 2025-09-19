import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../service/fetchAllUsers";
import { UsuarioProps } from "../types";
import { queryKeys } from "../queryKeys";

export function useFetchAllUsers() {
  return useQuery<UsuarioProps[], Error>({
    queryKey: queryKeys.allUsers(),
    queryFn: () => fetchAllUsers(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
