import { supabase } from "../supabase";
import type { EditLeitura, EditMedidor, EditLoja } from "../types";

export async function EditLeituraMedidor(
  medidor_id: string, // ✅ Parâmetro obrigatório
  loja_id: string, // ✅ Parâmetro obrigatório
  dataMedidor: EditMedidor, // ✅ Parâmetro obrigatório
  dataLoja: EditLoja, // ✅ Parâmetro obrigatório
  leitura_id?: string, // ✅ Parâmetro opcional
  dataLeitura?: EditLeitura // ✅ Parâmetro opcional
) {
  try {
    // ✅ 1. Declare as variáveis com 'let' para que o escopo seja a função inteira
    let data_loja = null;
    let data_leitura = null;
    let data_medidor = null;

    // ✅ 2. Execute a atualização da Loja
    const { data, error: error_loja } = await supabase
      .from("lojas")
      .update(dataLoja)
      .eq("id", loja_id)
      .select("*");

    if (error_loja) {
      throw new Error("Erro ao editar Loja: " + error_loja.message);
    }
    data_loja = data; // Atribua o valor à variável de escopo mais amplo

    // ✅ 3. Adicione a atualização da Leitura dentro da condição
    if (leitura_id && dataLeitura) {
      const { data, error: error_leitura } = await supabase
        .from("leituras")
        .update(dataLeitura)
        .eq("id", leitura_id)
        .select("*");

      if (error_leitura) {
        throw new Error("Erro ao editar Leitura: " + error_leitura.message);
      }
      data_leitura = data; // Atribua o valor aqui
    }

    // ✅ 4. Execute a atualização do Medidor
    const { data: medidorData, error: error_medidor } = await supabase
      .from("medidores")
      .update(dataMedidor)
      .eq("id", medidor_id)
      .select("*");

    if (error_medidor) {
      throw new Error("Erro ao editar Medidor: " + error_medidor.message);
    }
    data_medidor = medidorData; // Atribua o valor aqui

    // ✅ 5. Retorne os dados com segurança
    return {
      leitura: data_leitura?.[0] || null,
      medidor: data_medidor?.[0] || null, // Adicionado null safe operator
      loja: data_loja?.[0] || null, // Adicionado null safe operator
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error("Erro ao editar leitura e medidor: " + errorMessage);
  }
}
