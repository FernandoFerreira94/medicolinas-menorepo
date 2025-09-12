// services/CreateLojaService.ts

import { supabase } from "../supabase";
import type { CreateLojaData } from "../types";

export async function CreateLojaService({ loja, medidores }: CreateLojaData) {
  try {
    // 1. Verifique se a loja já existe.
    const { data: existingLoja, error: fetchError } = await supabase
      .from("lojas")
      .select("id")
      .or(`nome_loja.eq.${loja.nome_loja}, numero_loja.eq.${loja.numero_loja}`);

    if (fetchError) {
      throw new Error("Erro na verificação de loja: " + fetchError.message);
    }

    if (existingLoja && existingLoja.length > 0) {
      throw new Error("Esta loja já existe no banco de dados.");
    }

    // 2. Insira a nova loja
    const { data: lojaData, error: lojaError } = await supabase
      .from("lojas")
      .insert([loja])
      .select("*");

    if (lojaError) {
      throw new Error("Erro ao inserir a loja: " + lojaError.message);
    }

    const loja_id = lojaData[0].id;

    // 3. Vincula o ID da loja aos medidores e os insere
    let medidorData = null;
    if (medidores.length > 0) {
      const { data: insertedMedidoresData, error: medidorError } =
        await supabase
          .from("medidores")
          .insert(medidores.map((m) => ({ ...m, loja_id })))
          .select("*");

      if (medidorError) {
        throw new Error(
          "Erro ao inserir os medidores: " + medidorError.message
        );
      }
      medidorData = insertedMedidoresData;
    }

    // Retorno de sucesso (sem a propriedade 'error')
    return { lojaData, medidorData };
  } catch (error) {
    console.error("Erro no serviço de criação da loja:", error);
    // Relança o erro para ser capturado pelo hook useMutation
    throw error;
  }
}
