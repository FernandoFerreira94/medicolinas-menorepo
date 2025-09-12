import { supabase } from "../supabase";
import { UsuarioProps } from "../types"; // Importe a tipagem do seu usuário

export async function fetchUser(userId: string): Promise<UsuarioProps | null> {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*") // Seleciona todas as colunas
      .eq("user_id", userId) // Filtra pelo ID do usuário
      .single(); // Garante que retorne apenas um registro

    if (error) {
      console.error("Erro ao buscar usuário:", error.message);
      return null;
    }

    if (!data) {
      console.warn("Usuário não encontrado.");
      return null;
    }

    return data as UsuarioProps;
  } catch (err) {
    console.error("Exceção ao buscar usuário:", err);
    return null;
  }
}
