// hooks/useCreateLeitura.ts

import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateLeitura } from "../service/CreateLeitura";
import { CreateLeituraProps } from "../types";

export function useCreateLeitura(
  tipoMedicao: string | null,
  mes: number | null,
  ano: number | null,
  localidade: string | null,
  searchQuery: string | null,
  options?: UseMutationOptions<any, Error, CreateLeituraProps>
) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateLeituraProps>({
    mutationFn: async (variables) => {
      const result = await CreateLeitura(variables);
      return result;
    },
    onSuccess: (data, variables, context) => {
      // Invalida a query
      queryClient.invalidateQueries({
        queryKey: ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
      });

      // Chama a função onSuccess do componente, se houver
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }

      // Chama o toast DEPOIS de tudo
      toast.success("Leitura cadastrada com sucesso!");
    },
    onError: (error, variables, context) => {
      // Invalida a query
      queryClient.invalidateQueries({
        queryKey: ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
      });

      // Chama a função onError do componente, se houver
      if (options?.onError) {
        options.onError(error, variables, context);
      }

      // Chama o toast DEPOIS de tudo
      toast.error("Ops algo deu errado! acione o suporte!");
      console.error(error);
    },
    ...options,
  });
}
