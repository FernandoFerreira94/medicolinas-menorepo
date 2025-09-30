"use client";
import { useEffect, useState, useMemo } from "react";
import { Content } from "@/src/_componente/content";
import { InputDate } from "@/components/ui/inputDate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/src/context/useAppContext";
import { useFetchLojaTabela } from "@repo/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ExportExcel() {
  const {
    month,
    year,
    typeMedicao = "Energia",
    setTypeMedicao,
  } = useAppContext();

  // Lógica para calcular o mês e ano anteriores
  const nextMonth = (month as number) + 1;
  let nextYear = year;
  let actualMonth = month; // Este mês representa o mês de referência atual

  if (nextMonth > 12) {
    actualMonth = 1;
    nextYear = (year as number) + 1;
  } else {
  }

  // --- Lógica de Mês Anterior ---
  const prevMonth = (month as number) - 1;
  let prevYear = year;
  let finalPrevMonth = month;

  if (prevMonth < 1) {
    finalPrevMonth = 12; // Dezembro do ano anterior
    prevYear = (year as number) - 1;
  } else {
    finalPrevMonth = prevMonth;
    prevYear = year;
  }
  // ------------------------------

  // Fetch do Mês Anterior (Dados que serão a leitura_anterior)
  const { data: dataPrevMonth } = useFetchLojaTabela(
    typeMedicao,
    finalPrevMonth,
    prevYear
  );

  const { data } = useFetchLojaTabela(typeMedicao, month, year);

  // Cria o mapa de busca (lookup) para os dados do Mês Anterior
  const prevMonthDataMap = useMemo(() => {
    if (!dataPrevMonth || !Array.isArray(dataPrevMonth)) return {};

    return dataPrevMonth.reduce(
      (acc, store) => {
        // Usa o ID da loja como chave para busca rápida
        acc[store.id as string] = store;
        return acc;
      },
      {} as Record<string, (typeof dataPrevMonth)[number]>
    );
  }, [dataPrevMonth]);

  // ... Seus estados e useEffect (sem alterações, exceto o nome da variável de fetch)
  const [activeLeituras, setActiveLeituras] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);

  useEffect(() => {
    setTypeMedicao("Energia");
    if (data && Array.isArray(data)) {
      const activeStores = data.filter((item) => item.ativa === true);
      const vacantStores = data.filter((item) => item.ativa === false);

      const activeMetersWithReadings = activeStores.filter(
        (item) =>
          item.medidores &&
          item.medidores.length > 0 &&
          item.medidores[0].leituras &&
          item.medidores[0].leituras.length > 0
      ).length;

      const vacantMetersWithReadings = vacantStores.filter(
        (item) =>
          item.medidores &&
          item.medidores.length > 0 &&
          item.medidores[0].leituras &&
          item.medidores[0].leituras.length > 0
      ).length;

      setActiveLeituras(activeMetersWithReadings);
      setActiveCount(activeStores.length);
      setVacanLeitura(vacantMetersWithReadings);
      setVacantCount(vacantStores.length);
    }
  }, [data, setTypeMedicao]);

  const consumoMensal = (valor: number) => {
    const consumoMensal = valor * 0.62;
    return consumoMensal.toFixed(2);
  };

  // ... (Restante do JSX sem alterações)

  return (
    <Content title="Lista ">
      <section className="items-end gap-12 mt-8 flex w-full">
        <div className="flex gap-16 items-end ">
          <InputDate />
          <div className="w-40 h-full flex items-end">
            <Select required value={typeMedicao} onValueChange={setTypeMedicao}>
              <SelectTrigger>
                <SelectValue placeholder={"Selecione o tipo de medição"} />
              </SelectTrigger>
              <SelectContent className="flex">
                <SelectItem value="Energia">Energia</SelectItem>
                <SelectItem value="Agua">Agua</SelectItem>
                <SelectItem value="Gas">Gás</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button
            className="w-80 "
            variant={"default"}
          >{`Export Leitura ${typeMedicao} - ${month}/${year}`}</Button>
        </div>
      </section>
      <div className="mt-4 py-4 text-lg flex gap-4 font-semibold w-full justify-start pr-9">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>
      </div>
      <div className=" w-full h-full">
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <Table className="bg-white dark:bg-[#2B2B41] text-lg">
            <TableHeader>
              <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C] ">
                <TableHead>EUC</TableHead>
                <TableHead className="w-20">Nome fantasia</TableHead>
                <TableHead>Relogio</TableHead>
                <TableHead>leitura mês anterior</TableHead>
                <TableHead>leitura mês ref</TableHead>
                <TableHead>consumo mês anterior</TableHead>
                <TableHead>consumo mês ref</TableHead>
                <TableHead>%Var</TableHead>
                <TableHead>Energia pagar mes anterior</TableHead>
                <TableHead>Energia pagar mes ref</TableHead>
                <TableHead>Energia &Var</TableHead>
                <TableHead>C/Taxa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data
                  .sort((a, b) => {
                    const customOrder = [
                      "AE",
                      "D",
                      "NS",
                      "NT",
                      "QBT",
                      "QS",
                      "QT",
                      "CE",
                      "QVB",
                      "EST",
                      "CAG",
                      "AT",
                      " ",
                    ];
                    const aPrefix = a.prefixo_loja || "";
                    const bPrefix = b.prefixo_loja || "";

                    const aIndex = customOrder.indexOf(aPrefix);
                    const bIndex = customOrder.indexOf(bPrefix);

                    if (aIndex !== bIndex) {
                      return aIndex - bIndex;
                    }

                    return a.numero_loja.localeCompare(b.numero_loja);
                  })
                  .map((item) => {
                    // 1. Busca os dados do mês anterior usando o mapa
                    const prevStore = prevMonthDataMap[item.id || ""];

                    // 2. Extrai os valores do mês anterior (se existirem)
                    // Usamos a Leitura ATUAL do mês anterior como a Leitura ANTERIOR do mês de referência.
                    const prevLeituraAtual =
                      prevStore?.medidores[0]?.leituras[0]?.leitura_atual;
                    const prevConsumoMensal =
                      prevStore?.medidores[0]?.leituras[0]?.consumo_mensal;

                    // 3. Extrai os valores do mês de referência
                    const currentConsumoMensal =
                      item.medidores[0]?.leituras[0]?.consumo_mensal || 0;
                    const currentLeituraAtual =
                      item.medidores[0]?.leituras[0]?.leitura_atual;
                    const currentLeituraAnterior =
                      item.medidores[0]?.leituras[0]?.leitura_anterior;

                    // 4. Calcula a Variação Percentual do Consumo
                    let varConsumo = "N/A";
                    if (prevConsumoMensal && prevConsumoMensal > 0) {
                      const variation =
                        ((currentConsumoMensal - prevConsumoMensal) /
                          prevConsumoMensal) *
                        100;
                      varConsumo = `${variation.toFixed(2)}%`;
                    } else if (currentConsumoMensal > 0) {
                      varConsumo = "+100%"; // Aumento de consumo a partir de zero
                    }

                    return (
                      <TableRow
                        key={item.id}
                        className={`${!item.ativa && "bg-red-200/30 border border-b-red-500"} `}
                      >
                        <TableCell className="font-semibold ">
                          {item.prefixo_loja} - {item.numero_loja}
                        </TableCell>
                        <TableCell className="w-20 ">
                          {item.nome_loja}
                        </TableCell>
                        <TableCell>
                          {item.medidores[0].numero_relogio}
                        </TableCell>
                        {/* 🚨 LEITURA MÊS ANTERIOR (Valor da Leitura ATUAL do MÊS PASSADO) */}
                        <TableCell className="text-center">
                          {prevLeituraAtual || currentLeituraAnterior || "N/A"}
                        </TableCell>
                        {/* LEITURA MÊS REF (Valor da Leitura ATUAL do MÊS DE REFERÊNCIA) */}
                        <TableCell className="text-center">
                          {currentLeituraAtual || "N/A"}
                        </TableCell>
                        {/* CONSUMO MÊS ANTERIOR (Valor do Consumo MENSAL do MÊS PASSADO) */}
                        <TableCell className="text-center">
                          {prevConsumoMensal || 0}
                        </TableCell>
                        {/* CONSUMO MÊS REF (Valor do Consumo MENSAL do MÊS DE REFERÊNCIA) */}
                        <TableCell>{currentConsumoMensal}</TableCell>
                        {/* %Var (Variação Percentual do Consumo) */}
                        <TableCell>{varConsumo}</TableCell>
                        {/* ENERGIA PAGAR MÊS ANTERIOR (Custo calculado do MÊS PASSADO) */}
                        <TableCell>
                          {prevConsumoMensal
                            ? consumoMensal(prevConsumoMensal)
                            : "0.00"}
                        </TableCell>
                        {/* ENERGIA PAGAR MÊS REF (Custo calculado do MÊS DE REFERÊNCIA) */}
                        <TableCell>
                          {consumoMensal(currentConsumoMensal)}
                        </TableCell>
                        {/* ENERGIA &Var (Variação Percentual do Custo - Assumindo que o %Var de consumo serve) */}
                        <TableCell>{"-9,5%"}</TableCell>{" "}
                        {/* Mantenho o placeholder para o cálculo de custo */}
                        <TableCell className="">{"484"}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={11}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </Content>
  );
}
