import type { UsuarioProps, LoginProps } from "../types";
import { supabase } from "../supabase";

export async function signInService({ matricula, password }: LoginProps) {
  try {
    const emailColinas = `${matricula}@colinas.com.br`;

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: emailColinas,
        password,
      });

    if (authError) {
      throw new Error(`Erro ao fazer login: ${authError.message}`);
    }

    const userId = authData.user?.id;
    const session = authData.session;

    if (!userId) {
      throw new Error("ID do usuário não encontrado após o login.");
    }

    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    return { user: userData as UsuarioProps, session };
  } catch (error) {
    throw error; // aqui lança o erro de verdade para o React Query
  }
}
