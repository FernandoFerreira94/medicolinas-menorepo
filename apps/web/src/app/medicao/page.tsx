"use client";
import { Content } from "../../componente/content";
import { DateTipoMedicao } from "@/src/componente/dateTipoMedicao";
import { useAppContext } from "@/src/app/context/useAppContext";
import { Card } from "@/src/componente/card";
import { useGetMedicoes } from "@repo/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import type { LojaComMedidores } from "@repo/utils";

export default function Dashboard() {
  const { month, year, typeMedicao, localidade, searchQuery } = useAppContext();
  const { data, isLoading, error } = useGetMedicoes(
    typeMedicao,
    month,
    year,
    localidade,
    searchQuery
  );

  const [sortedLojas, setSortedLojas] = useState<LojaComMedidores[]>([]);

  useEffect(() => {
    if (data) {
      const tempLojas = [...data];

      const orderedLojas = tempLojas.sort((a, b) => {
        // --- Critério 1: Status da leitura (vermelho primeiro) ---
        const aHasReading = a.medidores[0]?.leituras.length > 0;
        const bHasReading = b.medidores[0]?.leituras.length > 0;

        if (aHasReading !== bHasReading) {
          return aHasReading ? 1 : -1;
        }

        // --- Critério 2: Prefixo (NT antes de NS) ---
        if (a.prefixo_loja > b.prefixo_loja) return -1;
        if (a.prefixo_loja < b.prefixo_loja) return 1;

        return a.numero_loja - b.numero_loja;
      });

      setSortedLojas(orderedLojas);
    }
  }, [data]);

  return (
    <Content title="Painel medição">
      <section className="w-full flex">
        <DateTipoMedicao />
      </section>

      <section className="w-full flex flex-wrap gap-8 mt-16">
        {isLoading ? (
          <>
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
            <Skeleton className="w-75 h-45" />
          </>
        ) : error ? (
          <p>Ocorreu um erro: {error.message}</p>
        ) : sortedLojas && sortedLojas.length > 0 ? (
          sortedLojas.map((loja) => {
            if (!loja.id) {
              console.error("ID ausente ou inválido para uma loja:", loja);
              return null;
            }
            return <Card key={loja.id} loja={loja} />;
          })
        ) : (
          <p>Nenhuma loja encontrada.</p>
        )}
      </section>
    </Content>
  );
}
