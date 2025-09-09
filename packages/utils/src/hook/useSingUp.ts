// apps/web/src/hooks/useSignUp.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { signUp } from "../service/signUp";
import { createSupabaseBrowserClient } from "../client";
import { UsuarioProps } from "../types"; // Importa a interface

export function useSignUp(
  options?: UseMutationOptions<any, Error, UsuarioProps>
) {
  const supabase = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (data: UsuarioProps) => {
      // Cria uma função que recebe os dados e chama signUp com o cliente e os dados
      return signUp(supabase, data);
    },
    onSuccess: () => {
      alert("Cadastro realizado com sucesso!");
    },
    onError: (error) => {
      alert(error.message);
    },
    ...options, // Garante que as opções adicionais sejam passadas corretamente
  });
}
