// apps/web/src/app/context/useUser.tsx

import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { fetchUser, UsuarioProps, supabase } from "../../index";

// Função de busca que será usada pelo useQuery
const getUserData = async (): Promise<UsuarioProps | null> => {
  const storedToken = Cookies.get("auth_token");

  if (!storedToken) {
    return null;
  }

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (supabaseUser) {
    const userData = await fetchUser(supabaseUser.id as string);
    return userData;
  }

  return null;
};

// O hook que você usará nos seus componentes
export function useUser() {
  return useQuery({
    queryKey: ["user"], // Chave única para identificar a query
    queryFn: getUserData, // A função que busca os dados
    retry: false, // Desabilita o retry automático para autenticação
    refetchOnWindowFocus: false, // Desabilita refetch desnecessário
  });
}
