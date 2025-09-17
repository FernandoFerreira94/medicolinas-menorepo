import { supabase } from "../supabase";

export async function fetchAllUsers() {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) {
    console.error("Erro ao buscar usuários:", error.message);
    return null;
  }
  return data;
}
