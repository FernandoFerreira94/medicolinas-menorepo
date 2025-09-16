import { useQuery } from "@tanstack/react-query";
import { fetchLojas } from "../service/fetchLojas";

export function useFetchLojas(
  tipoMedicao: string | null = null,
  mes: number | null = null,
  ano: number | null = null,
  localidade: string | null = null,
  searchQuery: string | null = null
) {
  return useQuery({
    queryKey: ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
    queryFn: () => fetchLojas(tipoMedicao, mes, ano, localidade, searchQuery),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
