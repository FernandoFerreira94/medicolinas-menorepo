import { supabase } from "../supabase";

export async function recoverRegistration(nome_completo: string) {
  if (!nome_completo) {
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("matricula")
    .eq("nome_completo", nome_completo)
    .single();

  if (error) {
    console.error("Erro ao buscar usuário:", error.message);
    return null;
  }

  return data ? data.matricula : null;
}
