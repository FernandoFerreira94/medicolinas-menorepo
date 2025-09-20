// app/api/usuarios/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Suas chaves de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "As variáveis de ambiente do Supabase não estão configuradas corretamente."
  );
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// A função DELETE agora aceita um objeto 'params'
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "O ID do usuário não foi fornecido." },
      { status: 400 }
    );
  }

  try {
    // 1. Deleta o usuário do sistema de AUTENTICAÇÃO do Supabase
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Erro ao deletar usuário do auth:", authError.message);
      return NextResponse.json(
        { error: "Erro ao deletar o usuário do sistema de autenticação." },
        { status: 500 }
      );
    }

    // 2. Deleta o registro do usuário na sua tabela 'usuarios'
    const { error: dbError } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("user_id", userId);

    if (dbError) {
      console.error(
        "Erro ao deletar usuário da tabela 'usuarios':",
        dbError.message
      );
      return NextResponse.json(
        { error: "Erro ao deletar o usuário da tabela do banco de dados." },
        { status: 500 }
      );
    }

    // Sucesso!
    return NextResponse.json(
      { message: "Usuário deletado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro inesperado no servidor:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado no servidor." },
      { status: 500 }
    );
  }
}
