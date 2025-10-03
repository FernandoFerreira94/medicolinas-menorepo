// hooks/useCreateLeitura.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateCusto } from "../service/createCusto";
import { CustoProps } from "../types";

export function useCreateCusto(
  options?: UseMutationOptions<any, Error, CustoProps>
) {
  return useMutation<any, Error, CustoProps>({
    mutationFn: async (variables) => {
      const result = await CreateCusto(variables);
      return result;
    },
    onSuccess: () => {
      toast(`Custo registrado com sucesso desse mês`);
    },
    onError: (error) => {
      toast.error("Ops algo deu errado! acione o suporte!");
      console.error(error);
    },
    ...options,
  });
}
