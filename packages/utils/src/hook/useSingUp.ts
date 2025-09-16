import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { signUp } from "../service/signUpService";
import { UsuarioProps } from "../types";
import { toast } from "sonner";

export function useSignUp(
  options?: UseMutationOptions<any, Error, UsuarioProps>
) {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Ops algo deu errado! acione o suporte!");
      console.error(error);
    },
    ...options,
  });
}
