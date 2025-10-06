import { useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchLojaTabela, truncateText } from "@repo/utils";
import { calcularDiferencaPercentualConsumo } from "../action/DiferencaPercentualConsumo";
import { formatFracao } from "../action/formatFracao";
import { calculoValorPagar } from "../action/ValorPagar";
import { calcularSomaEnergia } from "../action/SomaEnergia";
import { valorTotalPagarTaxa } from "../action/valorTotalPagarTaxa";
import { getPercentualClass } from "../action/getPercentualClass";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAppContext } from "@/src/context/useAppContext";
import Link from "next/link";

interface TabelaProps {
  custoRateioRef: number;
}

export function Tabela({ custoRateioRef }: TabelaProps) {
  const { month, year, typeMedicao } = useAppContext();
  const { data } = useFetchLojaTabela(typeMedicao, month, year);
  return (
    <ScrollArea className="w-full rounded-md border whitespace-nowrap">
      <Table className=" bg-white dark:bg-[#2B2B41] text-lg relative">
        <TableHeader>
          <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C]">
            <TableHead className=" border-x-2 border-gray-100 " rowSpan={2}>
              EUC
            </TableHead>
            <TableHead
              className="text-center border-x-2 border-gray-100 "
              rowSpan={2}
            >
              Nome fantasia
            </TableHead>
            <TableHead
              className=" border-x-2 border-gray-100 px-10 text-center"
              rowSpan={2}
            >
              Relógio
            </TableHead>

            <TableHead
              colSpan={2}
              className="text-center border-x-2 border-gray-100 px-20"
            >
              Leitura Relógio
            </TableHead>
            <TableHead
              colSpan={3}
              className="text-center border-x-2 border-gray-100 px-20"
            >
              Consumo
            </TableHead>
            {/* 
            <TableHead
              colSpan={4}
              className="text-center border-x-2 border-gray-100 px-20"
            >
              {typeMedicao === "Energia" && "Energia"}
              {typeMedicao === "Agua" && "Agua"}
              {typeMedicao === "Gas" && "Gas"} loja a pagar
            </TableHead>
            */}
          </TableRow>

          <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C] ">
            <TableHead className="border-x-2 px-12 border-gray-100 text-center">
              mês ref
            </TableHead>
            <TableHead className="border-x-2 px-6 border-gray-100 text-center">
              mês anterior
            </TableHead>
            <TableHead className="px-8 border-x-2 border-gray-100">
              {" "}
              mês ref
            </TableHead>
            <TableHead className="px-8 border-x-2 border-gray-100">
              {" "}
              mês anterior
            </TableHead>
            <TableHead className="text-center border-x-2 border-gray-100">
              %Var
            </TableHead>
            {/* 
            <TableHead className="border-x-2 px-6 border-gray-100 text-center">
              Pagar mês ref
            </TableHead>
            <TableHead className="border-x-2 px-6 border-gray-100 text-center">
              Pago mês anterior
            </TableHead>
            <TableHead className="border-x-2 px-6 border-gray-100 text-center">
              %Var
            </TableHead>
            <TableHead className="border-x-2 px-6 border-gray-100 text-center">
              C/Taxa
            </TableHead>
            */}
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

                const aIndex = customOrder.indexOf(aPrefix);
                const bIndex = customOrder.indexOf(bPrefix);

                // Ordena pelo prefixo primeiro
                if (aIndex !== bIndex) return aIndex - bIndex;

                // Extrai apenas a parte numérica do numero_loja
                const aNum = parseInt(
                  a.numero_loja?.match(/\d+/)?.[0] || "0",
                  10
                );
                const bNum = parseInt(
                  b.numero_loja?.match(/\d+/)?.[0] || "0",
                  10
                );

                return aNum - bNum;
              })
              .map((item) => {
                return (
                  <TableRow
                    title={`${item.nome_loja} - ${item.prefixo_loja}-${item.numero_loja}`}
                    key={item.id}
                    className={`${!item.ativa && "bg-red-200/30 border border-b-red-500"} text-center hover:bg-gray-500/40`}
                  >
                    <TableCell className="font-semibold text-start">
                      {item.prefixo_loja} - {item.numero_loja}
                    </TableCell>
                    <TableCell
                      className="text-start"
                      title={`
                            Detalhes do medidor: ${item.medidores[0]?.detalhes} \n 
Detalhes da leitura: ${item.medidores[0]?.leituras[1]?.detalhes_leitura}`}
                    >
                      <Link
                        href={`/loja/${item.id}/${item.medidores[0].id}`}
                        className="hover:text-blue-500 w-full"
                      >
                        {truncateText(item.nome_loja, 18)}
                      </Link>
                    </TableCell>
                    {/* 🚨 LEITURA MÊS ANTERIOR (Valor da Leitura ATUAL do MÊS PASSADO) */}
                    <TableCell className=" text-center">
                      {item.medidores[0].numero_relogio}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {/* LEITURA MÊS REF (Valor da Leitura ATUAL do MÊS DE REFERÊNCIA) */}
                      {item.medidores[0]?.leituras[1]?.leitura_atual || "###"}
                    </TableCell>
                    <TableCell>
                      {item.medidores[0]?.leituras[1]?.leitura_anterior ||
                        "###"}
                    </TableCell>
                    {/* CONSUMO MÊS ANTERIOR (Valor do Consumo MENSAL do MÊS PASSADO) */}
                    <TableCell className="font-semibold">
                      {formatFracao(
                        item.medidores[0]?.leituras[1]?.consumo_mensal,
                        item.medidores[0]?.tipo_medicao,
                        item.nome_loja
                      ) || "Sem medicao"}
                    </TableCell>
                    {/* CONSUMO MÊS REF (Valor do Consumo MENSAL do MÊS DE REFERÊNCIA) */}
                    <TableCell>
                      {formatFracao(
                        item.medidores[0]?.leituras[0]?.consumo_mensal,
                        item.medidores[0]?.tipo_medicao,
                        item.nome_loja
                      ) || ""}
                    </TableCell>
                    <TableCell
                      className={`px-8 font-semibold ${getPercentualClass(
                        calcularDiferencaPercentualConsumo(
                          item.medidores[0]?.leituras[1]?.consumo_mensal,
                          item.medidores[0]?.leituras[0]?.consumo_mensal
                        )
                      )} `}
                    >
                      {calcularDiferencaPercentualConsumo(
                        item.medidores[0]?.leituras[1]?.consumo_mensal,
                        item.medidores[0]?.leituras[0]?.consumo_mensal
                      )}{" "}
                      %
                    </TableCell>
                    {/* 
                    <TableCell className="font-semibold">
                      {calculoValorPagar(
                        item.medidores[0]?.leituras[1]?.consumo_mensal,
                        Number(custoRateioRef)
                      ) || 0}
                    </TableCell>
               
                    <TableCell>
                      {" "}
                      {calculoValorPagar(
                        item.medidores[0]?.leituras[0]?.consumo_mensal,
                        Number(custoRateioRef)
                      ) || 0}
                    </TableCell>
                    <TableCell
                      className={`${getPercentualClass(
                        calcularDiferencaPercentualConsumo(
                          calculoValorPagar(
                            item.medidores[0]?.leituras[1]?.consumo_mensal,
                            Number(custoRateioRef) || 0
                          ),
                          // Consumo Mês Anterior (para o valor base)
                          calculoValorPagar(
                            item.medidores[0]?.leituras[0]?.consumo_mensal,
                            Number(custoRateioRef) || 0
                          )
                        )
                      )} px-8`}
                    >
                      {calcularDiferencaPercentualConsumo(
                        calculoValorPagar(
                          item.medidores[0]?.leituras[1]?.consumo_mensal,
                          Number(custoRateioRef) || 0
                        ),
                        // Consumo Mês Anterior (para o valor base)
                        calculoValorPagar(
                          item.medidores[0]?.leituras[0]?.consumo_mensal,
                          Number(custoRateioRef) || 0
                        )
                      ) || 0}
                    </TableCell>
                    
                    <TableCell className="font-semibold text-blue-700 dark:text-blue-400">
                      {valorTotalPagarTaxa(
                        calculoValorPagar(
                          item.medidores[0]?.leituras[1]?.consumo_mensal,
                          Number(custoRateioRef)
                        )
                      )}
                    </TableCell>
                      */}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
