import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../service/fetchAllUsers";

export function useFetchAllUsers() {
  return useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => fetchAllUsers(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
