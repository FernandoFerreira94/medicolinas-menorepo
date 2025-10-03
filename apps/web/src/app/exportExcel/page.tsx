"use client";
import { useEffect, useState } from "react";
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
  const { month, year = 8, typeMedicao, setTypeMedicao } = useAppContext();

  const { data } = useFetchLojaTabela(typeMedicao, month, year);

  const [activeLeituras, setActiveLeituras] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);

  useEffect(() => {
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

  function calcularDiferencaPercentual(
    consumoAtual: number,
    consumoAnterior: number
  ): number {
    if (consumoAnterior + consumoAtual === 0) {
      return 0; // caso ambos sejam zero
    }

    if (consumoAnterior === 0) {
      return 100; // caso só o anterior seja zero
    }

    const percentual = (consumoAtual / consumoAnterior - 1) * 100;
    return parseFloat(percentual.toFixed(2));
  }

  function formatFracao(valor: number, type: string) {
    if (type === "Gas") {
      const valorFormatado = (valor / 10000).toFixed(2);
      return valorFormatado.replace(".", ",");
    }
    const valorFormatado = (valor / 1).toFixed(2);
    return valorFormatado.replace(".", ",");
  }

  function getPercentualClass(percentual: number): string {
    if (percentual > 20 || percentual === 0) {
      return "text-red-600 bg-red-200/40 ";
    } else if (percentual < -20) {
      return "text-yellow-600 bg-yellow-200/40";
    } else {
      return "text-green-600 bg-green-200/40";
    }
  }
  console.log(data);
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
      <div className=" w-full h-full ">
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <Table className="bg-white dark:bg-[#2B2B41] text-lg relative">
            <TableHeader className="sticky top-0 z-20 ">
              <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C]">
                <TableHead rowSpan={2}>EUC</TableHead>
                <TableHead rowSpan={2}>Nome fantasia</TableHead>
                <TableHead rowSpan={2}>Relógio</TableHead>

                <TableHead
                  colSpan={2}
                  className="text-center border-x-2 border-gray-800 px-20"
                >
                  Leitura Relógio
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="text-center border-x-2 border-gray-800 px-20"
                >
                  Consumo
                </TableHead>
                <TableHead
                  colSpan={4}
                  className="text-center border-x-2 border-gray-800 px-20"
                >
                  {typeMedicao === "Energia" && "Energia"}
                  {typeMedicao === "Agua" && "Agua"}
                  {typeMedicao === "Gas" && "Gas"} loja a pagar
                </TableHead>
              </TableRow>

              {/* Segunda linha para detalhar Leitura Relógio */}
              <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C] ">
                <TableHead className="border-x-2 px-6 border-gray-800 text-center">
                  mês anterior
                </TableHead>
                <TableHead className="border-x-2 px-12 border-gray-800 text-center">
                  mês ref
                </TableHead>
                <TableHead className="px-8 border-x-2 border-gray-800">
                  {" "}
                  mês anterior
                </TableHead>
                <TableHead className="px-8 border-x-2 border-gray-800">
                  {" "}
                  mês ref
                </TableHead>
                <TableHead className="text-center border-x-2 border-gray-800">
                  %Var
                </TableHead>
                <TableHead className="border-x-2 px-6 border-gray-800 text-center">
                  Energia pagar mês anterior
                </TableHead>
                <TableHead className="border-x-2 px-6 border-gray-800 text-center">
                  Energia pagar mês ref
                </TableHead>
                <TableHead className="border-x-2 px-6 border-gray-800 text-center">
                  Energia &Var
                </TableHead>
                <TableHead className="border-x-2 px-6 border-gray-800 text-center">
                  C/Taxa
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data
                  .sort((a, b) => {
                    const customOrder = [
                      "AE",
                      "TR",
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
                      "",
                    ];

                    const aPrefix = a.prefixo_loja || "";
                    const bPrefix = b.prefixo_loja || "";

                    let aIndex = customOrder.indexOf(aPrefix);
                    let bIndex = customOrder.indexOf(bPrefix);

                    // Se não existir no customOrder, manda pro final
                    if (aIndex === -1) aIndex = customOrder.length;
                    if (bIndex === -1) bIndex = customOrder.length;

                    if (aIndex !== bIndex) {
                      return aIndex - bIndex;
                    }

                    // Comparação numérica (se numero_loja for string)
                    return Number(a.numero_loja) - Number(b.numero_loja);
                  })

                  .map((item) => {
                    return (
                      <TableRow
                        key={item.id}
                        className={`${!item.ativa && "bg-red-200/30 border border-b-red-500"} text-center hover:bg-gray-500/40`}
                      >
                        <TableCell className="font-semibold text-start">
                          {item.prefixo_loja} - {item.numero_loja}
                        </TableCell>
                        <TableCell className="text-start">
                          {item.nome_loja}
                        </TableCell>
                        <TableCell className=" text-start">
                          {item.medidores[0].numero_relogio}
                        </TableCell>
                        {/* 🚨 LEITURA MÊS ANTERIOR (Valor da Leitura ATUAL do MÊS PASSADO) */}
                        <TableCell>
                          {item.medidores[0]?.leituras[1]?.leitura_anterior}
                        </TableCell>
                        {/* LEITURA MÊS REF (Valor da Leitura ATUAL do MÊS DE REFERÊNCIA) */}
                        <TableCell className="font-semibold">
                          {item.medidores[0]?.leituras[1]?.leitura_atual}
                        </TableCell>
                        {/* CONSUMO MÊS ANTERIOR (Valor do Consumo MENSAL do MÊS PASSADO) */}
                        <TableCell>
                          {formatFracao(
                            item.medidores[0]?.leituras[0]?.consumo_mensal,
                            item.medidores[0]?.tipo_medicao
                          )}
                        </TableCell>
                        {/* CONSUMO MÊS REF (Valor do Consumo MENSAL do MÊS DE REFERÊNCIA) */}
                        <TableCell className="font-semibold">
                          {formatFracao(
                            item.medidores[0]?.leituras[1]?.consumo_mensal,
                            item.medidores[0]?.tipo_medicao
                          )}
                        </TableCell>
                        <TableCell
                          className={`px-12 font-semibold ${getPercentualClass(
                            calcularDiferencaPercentual(
                              item.medidores[0]?.leituras[1]?.consumo_mensal,
                              item.medidores[0]?.leituras[0]?.consumo_mensal
                            )
                          )} `}
                        >
                          {calcularDiferencaPercentual(
                            item.medidores[0]?.leituras[1]?.consumo_mensal,
                            item.medidores[0]?.leituras[0]?.consumo_mensal
                          )}{" "}
                          %
                        </TableCell>
                        {/* ENERGIA PAGAR MÊS ANTERIOR (Custo calculado do MÊS PASSADO) */}
                        <TableCell></TableCell>
                        {/* ENERGIA PAGAR MÊS REF (Custo calculado do MÊS DE REFERÊNCIA) */}
                        <TableCell className="font-semibold"></TableCell>
                        {/* ENERGIA &Var (Variação Percentual do Custo - Assumindo que o %Var de consumo serve) */}
                        <TableCell></TableCell>{" "}
                        {/* Mantenho o placeholder para o cálculo de custo */}
                        <TableCell className="font-semibold">{"484"}</TableCell>
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
