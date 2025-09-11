// apps/web/src/hooks/useSignUp.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { signUp } from "../service/signUpService";
import { createSupabaseBrowserClient } from "../client";
import { UsuarioProps } from "../types"; // Importa a interface

export function useSignUp(
  options?: UseMutationOptions<any, Error, UsuarioProps>
) {
  const supabase = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      alert("Cadastro realizado com sucesso!");
    },
    onError: (error) => {
      alert(error.message);
    },
    ...options, // Garante que as opções adicionais sejam passadas corretamente
  });
}
