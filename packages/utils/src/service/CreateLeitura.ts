import { supabase } from "../supabase";
import type { CreateLeituraProps } from "../types";

export async function CreateLeitura(new_leitura: CreateLeituraProps) {
  // 1. Insere a nova leitura na tabela 'leituras'
  const { data: insertedData, error: insertError } = await supabase
    .from("leituras")
    .insert(new_leitura)
    .select("*")
    .single();

  if (insertError) {
    throw new Error("Erro ao inserir a leitura: " + insertError.message);
  }

  // Acessa o ID do medidor e a leitura atual da nova leitura
  const medidorId = insertedData.medidor_id;
  const novaLeitura = insertedData.leitura_atual;

  // 2. Atualiza a coluna 'ultima_leitura' na tabela 'medidores'
  const { data: updatedMedidor, error: updateError } = await supabase
    .from("medidores")
    .update({ ultima_leitura: novaLeitura })
    .eq("id", medidorId) // Condição para atualizar apenas o medidor correto
    .select("*")
    .single();

  if (updateError) {
    throw new Error("Erro ao atualizar o medidor: " + updateError.message);
  }

  // Retorna os dados da nova leitura criada
  return insertedData;
}
