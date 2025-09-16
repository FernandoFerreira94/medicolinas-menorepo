import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { CreateLojaData } from "../types";
import { CreateLojaService } from "../service/CreateLojaService";

export function useCreateLoja(
  options?: UseMutationOptions<any, Error, CreateLojaData>
) {
  return useMutation<any, Error, CreateLojaData>({
    mutationFn: async (variables) => {
      const result = await CreateLojaService(variables);
      return result;
    },
    ...options,
  });
}
