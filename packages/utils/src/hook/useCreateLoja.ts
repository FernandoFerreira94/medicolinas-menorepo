// hooks/useCreateLoja.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateLojaData } from "../types";
import { CreateLojaService } from "../service/CreateLojaService";

export function useCreateLoja(
  options?: UseMutationOptions<any, Error, CreateLojaData>
) {
  return useMutation<any, Error, CreateLojaData>({
    mutationFn: async (variables) => {
      // The service now throws an error on failure, which useMutation handles.
      // You no longer need to check for a 'result.error' property.
      const result = await CreateLojaService(variables);
      return result;
    },
    ...options,
  });
}
