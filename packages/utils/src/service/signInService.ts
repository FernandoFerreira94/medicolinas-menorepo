import type { UsuarioProps, LoginProps } from "../types";
import { supabase } from "../supabase";

export async function signInService({ matricula, password }: LoginProps) {
  const emailColinas = `${matricula}@colinas.com.br`;

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: emailColinas,
      password,
    });

  if (authError) {
    console.error("Erro ao fazer login:", authError.message);
    return null;
  }

  const userId = authData.user?.id;
  const session = authData.session;

  if (!userId) {
    return { error: "ID do usuário não encontrado após o login.", user: null };
  }

  const { data: userData, error: userError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.error("Erro ao buscar dados do usuário:", userError.message);
    return { error: userError.message, user: null };
  }

  return { error: null, user: userData as UsuarioProps, session };
}
