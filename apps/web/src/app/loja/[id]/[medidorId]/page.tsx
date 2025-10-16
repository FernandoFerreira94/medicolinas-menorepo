"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

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
  LeituraProps,
  formatarMedicao,
} from "@repo/utils";
import { Input } from "@/components/ui/input";
import { Localidade } from "@/src/_componente/dateTipoMedicao/localidade";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useAppContext } from "@/src/context/useAppContext";
import { toast } from "sonner";
import Image from "next/image";
import { PrefixoLoja } from "../../component/prefixoLoja";
import { Chart } from "../../component/Chart";

export default function InfoLoja({ params }: DetalhesProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { id, medidorId } = resolvedParams;
  const { month, year } = useAppContext();
  const [edit, setEdit] = useState(true);
  const [numero_relogio, setNumero_relogio] = useState("");
  const [quadroDistribuicao, setQuadroDistribuicao] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [leitura_atual, setLeitura_atual] = useState(0);
  const [detalheLeitura, setDetalheLeitura] = useState("");
  const [ativa, setAtiva] = useState(false);
  const [nome_loja, setNome_loja] = useState("");
  const [numero_loja, setNumero_loja] = useState("");
  const [detalheMedidor, setDetalheMedidor] = useState("");
  const [medicao_atual, setMedicao_atual] = useState("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useFetchLojaSingle(id, medidorId);
  const [prefixo, setPrefixo] = useState(data?.loja?.prefixo_loja || "");

  const { mutate, isPending } = useEditLeituraMedidor({
    onSuccess: () => {
      toast(
        `Loja ${data?.loja?.nome_loja} - ${data?.loja?.prefixo_loja}-${data?.loja?.numero_loja} editada com sucesso!`
      );
      router.push("/medicao");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { data: userData } = useFetchUser();
  const is_admin = userData?.user?.is_adm;

  const leituraFiltradaMonth = data?.medidor?.leituras?.filter(
    (leitura: LeituraProps) => leitura.mes === month && leitura.ano === year
  );

  useEffect(() => {
    if (data) {
      setNumero_relogio(data.medidor.numero_relogio);
      setLeitura_atual(
        data.medidor.leituras[0]?.leitura_atual || data.medidor.ultima_leitura
      );

      setDetalheLeitura(
        leituraFiltradaMonth[0].detalhes_leitura || "Sem detalhe"
      );
      setAtiva(data.loja.ativa);
      setQuadroDistribuicao(data?.medidor?.quadro_distribuicao || "");
      setDetalheMedidor(data?.medidor?.detalhes || "Sem detalhes");

      setNome_loja(data?.loja?.nome_loja || "");
      setNumero_loja(data?.loja?.numero_loja || "");
      setPrefixo(data?.loja?.prefixo_loja || "");
    }
  }, [data]);

  useEffect(() => {
    if (data?.medidor.localidade || data?.loja.prefixo_loja) {
      setLocalidade("");
      setPrefixo("");
      setTimeout(() => {
        setLocalidade(data.medidor.localidade);

        setPrefixo(data.loja.prefixo_loja);
      }, 500);
    }
  }, [data?.medidor.localidade, data?.loja.prefixo_loja]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Dados que sempre são enviados
    const dataMedidor = {
      numero_relogio,
      localidade,
      quadro_distribuicao: quadroDistribuicao,
      ultima_leitura: Number(leitura_atual),
      detalhes: detalheMedidor,
    };

    const dataLoja = {
      nome_loja,
      numero_loja: numero_loja,
      prefixo_loja: prefixo,
      ativa,
    };
    // ✅ CORREÇÃO: Use a lógica de if/else para chamar a mutação

    const dataLeitura = {
      leitura_atual: Number(leitura_atual),
      detalhes_leitura: detalheLeitura,
      foto_url: newPhoto,
      nome_loja_leitura: data?.loja?.nome_loja,
      medidor_id: data?.medidor?.id,
    };

    console.log("data Loja" + dataLoja.nome_loja);
    console.log(dataLeitura);

    mutate({
      medidor_id: data?.medidor?.id,
      ultima_leitura: leitura_atual,
      loja_id,
      dataMedidor,
      dataLoja,
      leitura_id,
      dataLeitura,
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const acceptedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!acceptedImageTypes.includes(file.type)) {
        toast.error(
          "Por favor, selecione um arquivo de imagem (JPG, PNG, WEBP)."
        );
        setNewPhoto(null);
        setPreviewUrl(null);
        return;
      }

      const MAX_FILE_SIZE_MB = 20;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`);
        setNewPhoto(null);
        setPreviewUrl(null);
        return;
      }

      setNewPhoto(file);
      setPreviewUrl(URL.createObjectURL(file)); // ← cria URL temporária
    } else {
      setNewPhoto(null);
      setPreviewUrl(null);
    }
  };

  if (isLoading || error || !data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }
  if (!data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }

  const leitura_id = leituraFiltradaMonth[0]?.id;
  const loja_id = data?.loja?.id;

  return (
    <Content
      title={`${data.loja.nome_loja} - ${data.loja.prefixo_loja} ${data.loja.numero_loja} - Mês referente ${month}/${year}`}
    >
      <main className="flex  items-start pt-8 gap-32 w-11/12 max-sm:flex-col max-sm:w-full">
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
            <PrefixoLoja
              edit={edit}
              prefixo={prefixo}
              setPrefixo={setPrefixo}
            />

            <div className="flex flex-col gap-2">
              <Label>Numero loja</Label>
              <Input
                disabled={edit}
                type="text"
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
              <Label>
                {data.medidor.numero_relogio !== "BUSWAY"
                  ? "Leitura mês anterior"
                  : "Consumo mês anterior"}
              </Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {formatarMedicao(leituraFiltradaMonth[0]?.leitura_anterior) ||
                  formatarMedicao(data?.medidor?.ultima_leitura)}
              </span>{" "}
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                {data.medidor.numero_relogio !== "BUSWAY"
                  ? "Leitura mês atual"
                  : "Consumo mês atual"}
              </Label>
              <Input
                disabled={edit}
                value={medicao_atual}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
                placeholder={
                  formatarMedicao(leituraFiltradaMonth[0]?.leitura_atual) ||
                  "Sem leitura"
                }
                onChange={(e) => setMedicao_atual(e.target.value)}
                type="number"
              />
            </div>
            {data.medidor.numero_relogio !== "BUSWAY" && (
              <div className="flex flex-col gap-2">
                <Label>Consumo</Label>
                <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                  {leituraFiltradaMonth[0]?.consumo_mensal || "Sem leitura"}
                </span>{" "}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Foto do relogio</Label>
              {leituraFiltradaMonth[0]?.foto_url || previewUrl ? (
                <div>
                  <Image
                    src={previewUrl || leituraFiltradaMonth[0]?.foto_url}
                    alt="Foto do relogio"
                    width={200}
                    height={200}
                  />
                </div>
              ) : (
                <span className="dark:bg-[#151526] text-gray-500 border py-2 px-4 rounded-md bg-white">
                  Sem foto
                </span>
              )}
              {!edit && (
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg, image/png, image/webp"
                  onChange={handleFileChange}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Detalhe do medidor</Label>
              <Textarea
                disabled={edit}
                value={detalheMedidor}
                onChange={(e) => setDetalheMedidor(e.target.value)}
                className={`border-3 ${edit ? "border-transparent " : "border-gray-700 dark:border-gray-300 "}`}
              />
            </div>
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

        <Chart data={data} />
      </main>
    </Content>
  );
}
