import { supabase } from "../supabase";
import { UsuarioProps } from "../types";

export async function edituser(userId: string, userData: UsuarioProps) {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .update(userData)
      .eq("user_id", userId)
      .select("*");

    if (error) {
      throw new Error("Erro ao editar usuário: " + error.message);
    }

    return data[0] as UsuarioProps;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error("Erro ao editar usuário: " + errorMessage);
  }
}
