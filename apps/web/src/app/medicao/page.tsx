"use client";
import { useState, useEffect } from "react";

import { Content } from "../../_componente/content";
import { DateTipoMedicao } from "@/src/_componente/dateTipoMedicao";
import { useAppContext } from "@/src/app/context/useAppContext";
import { Card } from "@/src/_componente/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchLojas, LojaComMedidores } from "@repo/utils";

export default function Dashboard() {
  const { month, year, typeMedicao, localidade, searchQuery } = useAppContext();
  const { data, isLoading, error } = useFetchLojas(
    typeMedicao,
    month,
    year,
    localidade,
    searchQuery
  );

  const [filteredLojas, setFilteredLojas] = useState<LojaComMedidores[]>([]);
  const [sortedLojas, setSortedLojas] = useState<LojaComMedidores[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);
  const [activeLeituras, setActiveLeituras] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);

  // useEffect 1: Filtra as lojas por data e tipo de medição
  useEffect(() => {
    if (data) {
      const selectedDate = new Date(year, month - 1, 1);

      const filtered = data.filter((loja) => {
        const relevantMedidor = loja.medidores.find(
          (medidor) => medidor.tipo_medicao === typeMedicao
        );

        if (!relevantMedidor || !relevantMedidor.data_instalacao) {
          return false;
        }

        const medidorCreationDate = new Date(relevantMedidor.data_instalacao);
        return (
          medidorCreationDate.getFullYear() < selectedDate.getFullYear() ||
          (medidorCreationDate.getFullYear() === selectedDate.getFullYear() &&
            medidorCreationDate.getMonth() <= selectedDate.getMonth())
        );
      });

      setFilteredLojas(filtered);
    }
  }, [data, typeMedicao, month, year]);

  useEffect(() => {
    if (filteredLojas.length > 0) {
      const tempLojas = [...filteredLojas];

      const activeStores = tempLojas.filter((loja) => loja.ativa === true);
      const vacantStores = tempLojas.filter((loja) => loja.ativa === false);

      const activeLojasComLeitura = activeStores.filter(
        (loja) => loja.medidores[0]?.leituras.length > 0
      );
      const vacantLojasComLeitura = vacantStores.filter(
        (loja) => loja.medidores[0]?.leituras.length > 0
      );

      setActiveLeituras(activeLojasComLeitura.length);
      setVacanLeitura(vacantLojasComLeitura.length);

      setActiveCount(activeStores.length);
      setVacantCount(vacantStores.length);

      const orderedLojas = tempLojas.sort((a, b) => {
        const aHasReading = a.medidores[0]?.leituras.length > 0;
        const bHasReading = b.medidores[0]?.leituras.length > 0;

        if (aHasReading !== bHasReading) {
          return aHasReading ? 1 : -1;
        }

        if (a.prefixo_loja > b.prefixo_loja) return -1;
        if (a.prefixo_loja < b.prefixo_loja) return 1;

        return parseInt(a.numero_loja) - parseInt(b.numero_loja);
      });

      setSortedLojas(orderedLojas);
    } else {
      // Limpa os estados se não houver dados filtrados
      setSortedLojas([]);
      setActiveLeituras(0);
      setVacanLeitura(0);
      setActiveCount(0);
      setVacantCount(0);
    }
  }, [filteredLojas]);

  console.log(data);

  return (
    <Content title="Painel medição">
      <section className="w-full flex">
        <DateTipoMedicao />
      </section>
      <div className="mt-4 py-4 text-lg flex gap-4 font-semibold w-full justify-start pr-9">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>
      </div>
      <section className="w-full flex flex-wrap  mt-4">
        {isLoading ? (
          <>
            <Skeleton className="w-75 h-45 mr-8 mb-8 " />
            <Skeleton className="w-75 h-45 mr-8 mb-8 " />
            <Skeleton className="w-75 h-45 mr-8 mb-8 " />
            <Skeleton className="w-75 h-45 mr-8 mb-8 " />
            <Skeleton className="w-75 h-45 mr-8 mb-8 " />
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
