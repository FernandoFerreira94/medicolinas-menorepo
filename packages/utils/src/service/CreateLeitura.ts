import { supabase } from "../supabase";
import type { CreateLeituraProps } from "../types";

export async function CreateLeitura(new_leitura: CreateLeituraProps) {
  const { data: insertedData, error: insertError } = await supabase
    .from("leituras")
    .insert(new_leitura)
    .select("*")
    .single();

  if (insertError) {
    throw new Error("Erro ao inserir a leitura: " + insertError.message);
  }

  const medidorId = insertedData.medidor_id;
  const novaLeitura = insertedData.leitura_atual;

  const { data: updatedMedidor, error: updateError } = await supabase
    .from("medidores")
    .update({ ultima_leitura: novaLeitura })
    .eq("id", medidorId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error("Erro ao atualizar o medidor: " + updateError.message);
  }

  return insertedData;
}
