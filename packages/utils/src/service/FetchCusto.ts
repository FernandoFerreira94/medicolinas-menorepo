import { supabase } from "../supabase";
import { FetchCusto } from "../types";

export async function fetchCusto(custo: FetchCusto) {
  const { data, error } = await supabase
    .from("custo_rateio")
    .select("*")
    .eq("mes_custo", custo.mes_custo)
    .eq("ano_custo", custo.ano_custo)
    .eq("tipo_custo", custo.tipo_custo)
    .single();

  if (error) {
    throw new Error("Erro ao busca o custo: " + error.message);
  }
  return data;
}
