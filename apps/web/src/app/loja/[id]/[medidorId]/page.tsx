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
import { Loader2Icon } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import React, { useState, useEffect } from "react";
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
import {
  useFetchLojaSingle,
  DetalhesProps,
  ChartDataItem,
  useFetchUser,
  useEditLeituraMedidor,
} from "@repo/utils";
import { Input } from "@/components/ui/input";
import { Localidade } from "@/src/_componente/dateTipoMedicao/localidade";
import { CustomTooltip, chartConfig } from "./CustomTooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useAppContext } from "@/src/context/useAppContext";
import { toast } from "sonner";

export default function InfoLoja({ params }: DetalhesProps) {
  const resolvedParams = React.use(params);
  const { id, medidorId } = resolvedParams;
  const { month, year } = useAppContext();
  const [edit, setEdit] = useState(true);
  const [numero_relogio, setNumero_relogio] = useState("");
  const [quadroDistribuicao, setQuadroDistribuicao] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [leitura_atual, setLeitura_atual] = useState<string>("");
  const [detalheLeitura, setDetalheLeitura] = useState("");
  const [ativa, setAtiva] = useState(false);
  const [nome_loja, setNome_loja] = useState("");
  const [numero_loja, setNumero_loja] = useState("");
  const [prefixo, setPrefixo] = useState("");

  const { data, isLoading, error } = useFetchLojaSingle(id, medidorId);
  console.log(data);
  const { mutate, isPending } = useEditLeituraMedidor({
    onSuccess: () => {
      toast.success(
        `Loja ${data?.loja?.nome_loja} - ${data?.loja?.prefixo_loja}-${data?.loja?.numero_loja} editada com sucesso!`
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { data: userData } = useFetchUser();

  const is_admin = userData?.user?.is_adm;

  useEffect(() => {
    if (data) {
      setNumero_relogio(data.medidor.numero_relogio);
      setLeitura_atual(
        data.medidor.leituras[0]?.leitura_atual || "Sem leitura"
      );
      setDetalheLeitura(
        data.medidor.leituras[0]?.detalhes_leitura || "Nenhum detalhe"
      );
      setAtiva(data.loja.ativa);
      setQuadroDistribuicao(data?.medidor?.quadro_distribuicao || "");
    }
    setNome_loja(data?.loja?.nome_loja || "");
    setNumero_loja(data?.loja?.numero_loja || "");
    setPrefixo(data?.loja?.prefixo_loja || "");
  }, [data]);

  useEffect(() => {
    if (data?.medidor.localidade || data?.loja.prefixo_loja) {
      setLocalidade("");
      setPrefixo("");
      setTimeout(() => {
        (setLocalidade(data.medidor.localidade),
          setPrefixo(data.loja.prefixo_loja));
      }, 0);
    }
  }, [data?.medidor.localidade]);

  if (!data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }

  let chartData: ChartDataItem[] = [];
  if (data && data.medidor.leituras) {
    const sortedLeituras = [...data.medidor.leituras].sort((a, b) => {
      const dateA = new Date(a.ano, a.mes - 1, 1);
      const dateB = new Date(b.ano, b.mes - 1, 1);
      return dateA.getTime() - dateB.getTime();
    });

    const lastSixLeituras = sortedLeituras.slice(-6);
    chartData = lastSixLeituras.map((leitura) => ({
      month: `${leitura.mes}/${leitura.ano}`,
      consumo: leitura.consumo_mensal,
      detalhes: leitura.detalhes_leitura || "Nenhum detalhe disponível",
    }));
  }

  if (isLoading || error || !data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }

  const leitura_id = data?.medidor?.leituras[0]?.id;
  const loja_id = data?.loja?.id;
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Dados que sempre são enviados
    const dataMedidor = {
      numero_relogio,
      localidade,
      quadro_distribuicao: quadroDistribuicao,
      ultima_leitura: Number(leitura_atual),
    };

    const dataLoja = {
      nome_loja,
      numero_loja: Number(numero_loja),
      prefixo_loja: prefixo,
    };

    // ✅ CORREÇÃO: Use a lógica de if/else para chamar a mutação
    if (data?.medidor.leituras.length > 0) {
      const dataLeitura = {
        leitura_atual: Number(leitura_atual),
        detalhes_leitura: detalheLeitura,
      };
      mutate({
        medidor_id: data?.medidor?.id,
        loja_id,
        dataMedidor,
        dataLoja,
        leitura_id,
        dataLeitura,
      });
    } else {
      // Se não houver leitura, chame a mutação sem os dados de leitura
      mutate({
        medidor_id: data?.medidor?.id,
        loja_id,
        dataMedidor,
        dataLoja,
      });
    }
  }
  console.log(data);
  return (
    <Content
      title={`${data.loja.nome_loja} - ${data.loja.prefixo_loja} ${data.loja.numero_loja} - Mês referente ${month}/${year}`}
    >
      <main className="flex  items-center pt-8 gap-32 w-11/12 ">
        <section className="w-full ">
          <div className="flex items-center  space-x-2 ">
            {is_admin && (
              <>
                <Switch
                  id="ativa"
                  onCheckedChange={() => setEdit(!edit)}
                  checked={!edit}
                />
                <Label htmlFor="edit">Modo editar</Label>
              </>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-8"
          >
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
              <Switch
                id="ativa"
                checked={ativa}
                onCheckedChange={setAtiva}
                disabled={edit}
              />
              {ativa ? (
                <Label htmlFor="ativa">Esta loja esta ativa</Label>
              ) : (
                <Label htmlFor="ativa">Esta loja esta desativada</Label>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nome da loja</Label>
              <Input
                disabled={edit}
                value={nome_loja}
                onChange={(e) => setNome_loja(e.target.value)}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Prefixo loja</Label>
              <Select
                required
                value={prefixo}
                onValueChange={setPrefixo}
                disabled={edit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NT">NT</SelectItem>
                  <SelectItem value="NS">NS</SelectItem>
                  <SelectItem value="QT">QT</SelectItem>
                  <SelectItem value="QS">QS</SelectItem>
                  <SelectItem value=" ">outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Numero loja</Label>
              <Input
                disabled={edit}
                type="number"
                value={numero_loja}
                onChange={(e) => setNumero_loja(e.target.value)}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de Medicao</Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {data.medidor.tipo_medicao}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Numero do relogio</Label>
              <Input
                disabled={edit}
                value={numero_relogio}
                onChange={(e) => setNumero_relogio(e.target.value)}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>localidade relogio</Label>
              <Localidade
                key={data.medidor.localidade}
                setValue={(value) => setLocalidade(value)}
                value={localidade}
                disabled={edit}
              />
            </div>
            {data.medidor.tipo_medicao === "Energia" && (
              <div className="flex flex-col gap-2">
                <Label>Quadro distribuição</Label>
                <Input
                  disabled={edit}
                  value={quadroDistribuicao}
                  onChange={(e) => setQuadroDistribuicao(e.target.value)}
                  placeholder="Quadro Distribuição"
                  className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Leitura mês anterior</Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {data.medidor.leituras.length === 0
                  ? data.medidor.ultima_leitura
                  : data.medidor.leituras[0].leitura_anterior}
              </span>{" "}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Leitura mês atual</Label>
              <Input
                disabled={edit}
                value={leitura_atual}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
                placeholder={
                  data.medidor.leituras.length === 0 ? "Sem leitura" : ""
                }
                onChange={(e) => setLeitura_atual(e.target.value)}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Consumo</Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {data.medidor.leituras.length === 0
                  ? "Sem leitura"
                  : data.medidor.leituras[0].consumo_mensal}
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
            <div className="flex flex-col gap-2">
              <Label>Detalhe da leitura</Label>
              <Textarea
                disabled={edit}
                value={detalheLeitura}
                onChange={(e) => setDetalheLeitura(e.target.value)}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
              />
            </div>
            {!edit && (
              <Button
                type="submit"
                variant={"default"}
                disabled={edit}
                className="w-full mt-4"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            )}
          </form>
        </section>
        <section className="w-full  border">
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
              <Tooltip content={<CustomTooltip />} />
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
