// apps/web/src/hooks/useSignIn.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { signInService } from "../service/signInService";
import { LoginProps, UsuarioProps } from "../types"; // Importe a interface LoginProps
import { Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../client";

// Tipagem para o retorno da mutação
interface SignInMutationReturn {
  auth: any;
  usuario: UsuarioProps[] | null;
}

export function useSignIn(
  options?: UseMutationOptions<any, Error, LoginProps>
) {
  return useMutation<SignInMutationReturn | null, Error, LoginProps>({
    mutationFn: async (variables) => {
      return await signInService(variables);
    },
    ...options,
  });
}
