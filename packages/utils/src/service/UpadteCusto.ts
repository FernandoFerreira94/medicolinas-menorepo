import { supabase } from "../supabase";

import type { FetchCusto, CustoProps } from "../types";

export async function updateCusto(filtro: FetchCusto, payload: CustoProps) {
  const { data, error } = await supabase
    .from("custo_rateio")
    .update(payload)
    .eq("mes_custo", filtro.mes_custo)
    .eq("ano_custo", filtro.ano_custo)
    .eq("tipo_custo", filtro.tipo_custo)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar loja:", error.message);
    throw error;
  }
  return data;
}
