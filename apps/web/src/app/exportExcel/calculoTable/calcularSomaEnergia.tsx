type Loja = {
  prefixo_loja: string;
  nome_loja: string;
  medidores: {
    leituras: {
      consumo_mensal: number;
    }[];
  }[];
};

// Função que calcula a soma de consumo das lojas
export function calcularSomaEnergia(lojas: Loja[] | null | undefined) {
  // 🔹 lista de prefixos ou lojas que serão somadas separadamente
  if (!lojas || lojas.length === 0) {
    return {
      totalPrincipal: 0,
      totalSeparado: 0,
      totalGeral: 0,
    };
  }

  const grupoSeparado = [
    "Central Agua Gelada ( Chill 01 )",
    "Central Agua Gelada ( Chill 02 )",
    "Central Agua Gelada ( Bomba )",
    "Casa Máquinas",
    "Cag Nova ( Piso Tecnico )",
  ]; // exemplo -> aqui você decide quais

  // Inicializa os totais
  let totalPrincipal = 0;
  let totalSeparado = 0;

  lojas?.forEach((loja) => {
    const consumoRef = loja.medidores[0]?.leituras[1]?.consumo_mensal || 0;

    if (grupoSeparado.includes(loja.nome_loja)) {
      // vai pro grupo separado
      totalSeparado += consumoRef;
    } else {
      // vai pro grupo principal
      totalPrincipal += consumoRef;
    }
  });
  const totalGeral = totalPrincipal + totalSeparado;

  const totalGeralFormatado = (valor: number) => {
    const valorFormatado = (valor / 100).toFixed(2);

    return valorFormatado.replace(".", ",");
  };
  const valorGeral = totalGeralFormatado(totalGeral);
  return {
    totalPrincipal,
    totalSeparado,
    valorGeral,
  };
}
