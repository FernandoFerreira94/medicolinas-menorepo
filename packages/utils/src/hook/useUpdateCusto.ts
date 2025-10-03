// hooks/useCreateLeitura.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCusto } from "../service/UpadteCusto";
import { CustoProps, FetchCusto } from "../types";
interface UpdatePorps {
  filtro: FetchCusto;
  payload: CustoProps;
}

export function useUpdateCusto(
  options?: UseMutationOptions<any, Error, UpdatePorps>
) {
  return useMutation<any, Error, UpdatePorps>({
    mutationFn: async ({ filtro, payload }) => {
      const result = await updateCusto(filtro, payload);
      return result;
    },
    onSuccess: () => {
      toast(`Custo alterado com sucesso desse mês`);
    },
    onError: (error) => {
      toast.error("Ops algo deu errado! acione o suporte!");
      console.error(error);
    },
    ...options,
  });
}
