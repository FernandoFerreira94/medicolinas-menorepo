"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import React from "react";

import { Content } from "@/src/_componente/content";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFetchLojaSingle } from "@repo/utils";
import { Textarea } from "@/components/ui/textarea";

interface DetalhesProps {
  params: Promise<{
    id: string;
    medidorId: string;
  }>;
}

const chartConfig = {
  consumo: {
    label: "Consumo Mensal",
    color: "#3D3C6C",
  },
} satisfies ChartConfig;

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    // O payload é um array de objetos, um para cada Bar ou Line no gráfico
    const data = payload[0].payload;

    return (
      <div className="bg-[#151526] border border-gray-700 p-3 rounded shadow-lg text-sm text-gray-200">
        <p className="font-semibold">{`Mês: ${label}`}</p>
        <p className="font-bold text-lg text-blue-400">{`Consumo: ${data.consumo}`}</p>
        {/* Aqui você adiciona a sua mensagem de detalhe */}
        <p className="text-gray-400 mt-2">Detalhes : {data.detalhes}</p>
      </div>
    );
  }
  return null;
};

export default function InfoLoja({ params }: DetalhesProps) {
  const resolvedParams = React.use(params);
  const { id, medidorId } = resolvedParams;

  const { data, isLoading, error } = useFetchLojaSingle(id, medidorId);
  console.log(data);
  if (!data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }

  // teste para visualizar
  /*
  const chartData = [
    { month: "04/2025", consumo: 350 },
    { month: "05/2025", consumo: 420 },
    { month: "06/2025", consumo: 380 },
    { month: "07/2025", consumo: 450 },
    { month: "08/2025", consumo: 410 },
    { month: "09/2025", consumo: 490 },
  ];
  */
  let chartData: { month: string; consumo: number }[] = [];
  if (data && data.medidor.leituras) {
    // Ordena as leituras da mais antiga para a mais recente
    const sortedLeituras = [...data.medidor.leituras].sort((a, b) => {
      const dateA = new Date(a.ano, a.mes - 1, 1);
      const dateB = new Date(b.ano, b.mes - 1, 1);
      return dateA.getTime() - dateB.getTime();
    });
    // Pega as 6 últimas leituras e formata para o gráfico
    const lastSixLeituras = sortedLeituras.slice(-6);

    chartData = lastSixLeituras.map((leitura) => ({
      month: `${leitura.mes}/${leitura.ano}`,
      consumo: leitura.consumo_mensal,
      detalhes: leitura.detalhes_leitura,
    }));
  }

  if (isLoading || error || !data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }

  return (
    <Content
      title={`${data.loja.nome_loja} - ${data.loja.prefixo_loja} ${data.loja.numero_loja}`}
    >
      <main className="flex flex-col gap-12 pt-8 w-full md:w-2/5">
        <section className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Complexo</Label>
            <Select required value={data.loja.complexo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shopping Colinas">
                  Shopping Colinas
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="ativa" checked={data.loja.ativa} />
            {data.loja.ativa ? (
              <Label htmlFor="ativa">Esta loja esta ativa</Label>
            ) : (
              <Label htmlFor="ativa">Esta loja esta desativada</Label>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tipo de Medicao</Label>
            <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
              {data.medidor.tipo_medicao}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Numero do relogio</Label>
            <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
              {data.medidor.numero_relogio}
            </span>{" "}
          </div>
          <div className="flex flex-col gap-2">
            <Label>localidade relogio</Label>
            <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
              {data.medidor.localidade}
            </span>{" "}
          </div>

          {data.medidor.tipo_medicao === "Energia" && (
            <div className="flex flex-col gap-2">
              <Label>Quadro distribuição</Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                ?????
              </span>{" "}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Medição atual</Label>
            <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
              {data.medidor.ultima_leitura}
            </span>{" "}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Foto do relogio</Label>
            <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
              ????
            </span>{" "}
          </div>
          {data.medidor.detalhes && (
            <div className="flex flex-col gap-2">
              <Label>Detalhe do medidor</Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {data.medidor.detalhes}
              </span>{" "}
            </div>
          )}
        </section>
        <section className="w-full mt-auto border">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
              />
              <YAxis dataKey="consumo" />
              <Tooltip
                content={
                  <CustomTooltip
                    active={true}
                    payload={undefined}
                    label={undefined}
                  />
                }
              />
              <Bar
                dataKey="consumo"
                fill="var(--color-consumo)"
                radius={4}
                barSize={100}
              >
                <LabelList dataKey="consumo" position="top" />
              </Bar>
            </BarChart>
          </ChartContainer>
        </section>
      </main>
    </Content>
  );
}
