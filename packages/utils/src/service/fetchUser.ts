import { supabase } from "../supabase";
import { UsuarioProps } from "../types";

export async function fetchUser(userId: string): Promise<UsuarioProps | null> {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", userId)
      .single();
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
