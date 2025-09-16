// services/fetchLojasWithMedidores.ts

import { supabase } from "../supabase";
import type { LojaComMedidores } from "../types";

export async function fetchLojas(
  tipoMedicao: string | null = null,
  mes: number | null = null,
  ano: number | null = null,
  localidade: string | null = null,
  searchQuery: string | null = null
): Promise<LojaComMedidores[] | null> {
  let query = supabase.from("lojas").select(`
    id,
    nome_loja,
    numero_loja,
    ativa,
    tem_energia,
    tem_agua,
    tem_gas,
    complexo,
    prefixo_loja,
    medidores (
      id,
      tipo_medicao,
      localidade,
      numero_relogio,
      ultima_leitura,
      detalhes,
      leituras (
        leitura_atual,
        consumo_mensal,
        mes,
        ano
      )
    )
  `);

  if (tipoMedicao) {
    query = query.filter("medidores.tipo_medicao", "eq", tipoMedicao);
  }

  // Se a localidade existir E NÃO for "all", aplique o filtro.
  if (localidade && localidade !== "all") {
    query = query.filter("medidores.localidade", "eq", localidade);
  }

  if (mes && ano) {
    query = query.filter("medidores.leituras.mes", "eq", mes);
    query = query.filter("medidores.leituras.ano", "eq", ano);
  }

  // **CÓDIGO CORRIGIDO AQUI**
  if (searchQuery) {
    const formattedQuery = `%${searchQuery.toLowerCase()}%`;
    query = query.or(
      `nome_loja.ilike.${formattedQuery},numero_loja.ilike.${formattedQuery}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar lojas, medidores e leituras:", error.message);
    throw new Error(error.message);
  }

  return data as LojaComMedidores[];
}
