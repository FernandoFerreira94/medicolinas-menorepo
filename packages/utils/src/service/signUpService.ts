import type { UsuarioProps } from "../types";
import { supabase } from "../supabase";

export async function signUp({
  nome_completo,
  cpf,
  matricula,
  is_adm,
  permissao_energia,
  permissao_agua,
  permissao_gas,
  funcao,
}: UsuarioProps) {
  const emailColinas = `${matricula}@colinas.com.br`;
  const passwordCpf = cpf.slice(0, 6);

  // Usa o cliente recebido como parâmetro
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: emailColinas,
    password: passwordCpf,
  });

  if (authError) {
    console.error(authError);
    return null;
  }

  const userId = authData.user?.id;

  // Usa o cliente recebido como parâmetro
  const { data: dbData, error: dbError } = await supabase
    .from("usuarios")
    .insert([
      {
        user_id: userId,
        nome_completo,
        cpf,
        matricula,
        is_adm,
        permissao_energia,
        permissao_agua,
        permissao_gas,
        funcao,
      },
    ])
    .select();

  if (dbError) {
    console.error(dbError);
    return null;
  }

  return { auth: authData, usuario: dbData };
}
