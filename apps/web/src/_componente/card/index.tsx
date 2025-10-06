import { useState } from "react";
import Link from "next/link";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonLoading } from "@/components/ui/buttonLoading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/src/context/useAppContext";
import {
  useCreateLeitura,
  useFetchUser,
  LojaProps,
  formatarFracao,
  formatarMedicao,
  truncateText,
} from "@repo/utils";
import { Textarea } from "@/components/ui/textarea";

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

export function Card({ loja }: { loja: LojaProps }) {
  const { month, year, typeMedicao, localidade, searchQuery } = useAppContext();
  const { mutate, isPending } = useCreateLeitura(
    typeMedicao,
    month,
    year,
    localidade,
    searchQuery
  );

  const { data } = useFetchUser();
  const user = data?.user;
  const firstName = user?.nome_completo.split(" ")[0];

  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    medicao_atual: 0,
    detalhes_leitura: "",
    foto: null,
  });

  if (!loja.medidores || loja.medidores.length === 0) {
    return <span className="text-gray-500"></span>;
  }

  if (!user) {
    return (
      <span className="text-gray-500">
        Por favor, faça login para registrar uma leitura.
      </span>
    );
  }

  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.medicao_atual || formData.medicao_atual <= 0) {
      toast.info("Por favor, preencha a medição atual com um valor válido.");
      return;
    }

    if (!user.is_adm) {
      if (formData.medicao_atual < medidor.ultima_leitura) {
        toast.warning("A medição atual deve ser maior ou igual ao anterior.");
        return;
      }
    }

    setIsFormSheetOpen(false);
    setIsConfirmSheetOpen(true);
  };

  const handleFinalSubmit = () => {
    // 2. Mapeamento dos fatores de multiplicação por nome da loja
    // Use um objeto para facilitar a consulta
    const fatoresMultiplicacao: { [key: string]: number } = {
      "Coco Bambu": 240,
      "+54 Parrilla": 40,
      "Americanas Express": 40,
      "Teatro Colinas": 40,
      "Da Gema": 60,
      "Carregadores Veiculos C4": 20,
    };

    const fator = fatoresMultiplicacao[loja.nome_loja] || 1;

    const result = formData.medicao_atual - medidor.ultima_leitura;

    const consumoMensal = fator !== 1 ? result * fator : result;

    const new_leitura = {
      medidor_id: medidor.id,
      mes: month,
      ano: year,
      leitura_anterior: medidor.ultima_leitura,
      leitura_atual: formData.medicao_atual,
      foto_url: null, // Verifique se 'formData.foto' pode ser usado aqui
      consumo_mensal: consumoMensal,
      nome_usuario: `${firstName} - ${user.funcao}`,

      detalhes_leitura: `Leitura feito por ${firstName} - ${user.funcao} / data: ${currentDate},  Detalhes a acrecentar: ${formData.detalhes_leitura || null}`,
      data_leitura: new Date("2025-06-01").toISOString(), // Atenção: data fixa? Provavelmente deveria ser 'new Date().toISOString()'
      nome_loja_leitura: loja.nome_loja,
    };

    mutate(new_leitura);

    setIsConfirmSheetOpen(false);
    setFormData({
      medicao_atual: 0,
      detalhes_leitura: "",
      foto: null,
    });
  };

  const medidor = loja.medidores[0];

  const verifiedMedidor = () => {
    if (medidor.leituras[0]?.leitura_atual) {
      return true;
    }
    return false;
  };
  const isMedidorVerified = verifiedMedidor();

  // CORREÇÃO: Nova lógica para verificar se a leitura já foi feita no mês
  const medidorJaLidoNoMes = medidor.leituras.some(
    (leitura) => leitura.mes === month && leitura.ano === year
  );

  const shouldDisableButton = medidorJaLidoNoMes || 26 < 25;

  // Função para limitar o texto

  const nomePrefixo = `${loja.prefixo_loja} - ${loja.numero_loja}`;

  return (
    <div
      className={`border-l-8  ${isMedidorVerified ? "border-green-500" : "border-red-500"} flex flex-col w-100  gap-1 justify-between py-4 px-4 rounded-xl text-gray-900 dark:text-gray-50 mr-8 mb-8
      bg-white dark:bg-[#151526] hover:shadow-[2px_2px_10px_4px_#A7B3C3,-2px_-2px_10px_#FFFFFF] transition-shadow duration-300 shadow-xl`}
      key={loja.id}
    >
      <div className="w-full flex justify-between">
        <span title={loja.nome_loja} className="text-lg font-semibold">
          {truncateText(loja.nome_loja, 17)}
        </span>
        <div className="flex gap-2 ">
          <span className="text-lg font-semibold">
            {truncateText(nomePrefixo, 17)}
          </span>
          <span
            className={`${loja.ativa ? "bg-green-500" : "bg-red-500"} rounded-full my-1.5 h-4 w-4 `}
          ></span>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <span>Nº relogio</span>
        <span>{medidor.numero_relogio}</span>
      </div>
      <div className="w-full flex justify-between">
        <span>Localidade</span>
        <span>{medidor.localidade}</span>
      </div>
      <div className="w-full flex justify-between">
        <span>Leitura mês anterior </span>
        <span>
          {" "}
          {medidor.leituras[0]?.leitura_anterior
            ? formatarMedicao(medidor.leituras[0]?.leitura_anterior)
            : formatarMedicao(medidor.ultima_leitura)}
        </span>
      </div>
      <div className="w-full flex justify-between">
        <span>Leitura atual</span>
        <span>
          {formatarMedicao(medidor.leituras[0]?.leitura_atual) || "--- ---"}
        </span>
      </div>
      <div className="w-full flex justify-between">
        <span>Consumo</span>
        <span>
          {formatarFracao(
            medidor.leituras[0]?.consumo_mensal,
            medidor.tipo_medicao,
            loja.nome_loja,
            medidor.leituras[0]?.leitura_anterior,
            medidor.leituras[0]?.leitura_atual
          )}{" "}
          {medidor.tipo_medicao === "Energia" ? "kWh" : "m3"}
        </span>
      </div>

      <div className="w-full flex justify-between gap-6">
        <Button variant="outline" className="h-8 w-full">
          <Link
            href={`/loja/${loja.id}/${loja.medidores[0].id}`}
            className=" w-full h-full flex justify-center items-center"
          >
            Detalhes
          </Link>
        </Button>

        <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
          <SheetTrigger asChild>
            <Button disabled={shouldDisableButton} className="w-full h-8 ">
              Medição
            </Button>
          </SheetTrigger>
          <SheetContent className="w-8/12  h-full">
            <SheetHeader className=" h-full">
              <SheetTitle className="text-2xl font-semiboldborder">
                Registrar medição
              </SheetTitle>
              <SheetTitle className="flex justify-between items-center mt-4">
                <span className="text-lg font-medium">
                  {loja.nome_loja} / {loja.prefixo_loja} - {loja.numero_loja}
                </span>
                <span
                  className={`${loja.ativa ? "bg-green-500" : "bg-red-500"} h-5 w-5 rounded-full`}
                ></span>
              </SheetTitle>

              <SheetDescription asChild className="text-gray-50 h-full ">
                <div className="text-gray-50 flex-col flex gap-4 mt-8  ">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Complexo</span>
                    <Label>{loja.complexo}</Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">
                      Tipo de medição
                    </span>
                    <Label>{loja.medidores[0].tipo_medicao}</Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Nº Relogio</span>
                    <Label>{loja.medidores[0].numero_relogio}</Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Localização</span>
                    <Label>{loja.medidores[0].localidade}</Label>
                  </div>
                  {loja.medidores[0].tipo_medicao === "Energia" && (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-lg">Quadro</span>
                      <Label>????</Label>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">
                      Última medição
                    </span>
                    <Label
                      className={`bg-gray-900 rounded-lg  py-3 px-2 dark:bg-gray-600   border ${formData.medicao_atual >= medidor.ultima_leitura ? "border-green-500" : "border-red-500"} `}
                    >
                      {medidor.ultima_leitura}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Medição atual</span>
                    <Input
                      type="number"
                      placeholder="Digite a medição"
                      value={formData.medicao_atual || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          medicao_atual: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Foto Relógio</span>
                    <Input
                      type="file"
                      //  onChange={(e) =>
                      //setFormData({
                      //        ...formData,
                      //      foto: e.target.files?.[0] || null,
                      //})
                      //  }
                    />
                  </div>

                  {formData.medicao_atual >= medidor.ultima_leitura && (
                    <Button
                      onClick={handleNextStep}
                      className="w-full  mt-auto"
                      variant={"outline"}
                    >
                      Registrar medição
                    </Button>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        {/* --- Segundo Sheet: Confirmação dos Dados --- */}
        <Sheet open={isConfirmSheetOpen} onOpenChange={setIsConfirmSheetOpen}>
          <SheetContent className="w-8/12 text-gray-50 ">
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold">
                Os dados estão corretos?
              </SheetTitle>
              <SheetTitle className="flex justify-between items-center mt-4 ">
                <span className="text-lg font-medium">
                  {loja.nome_loja} - {loja.numero_loja}
                </span>
                <span
                  className={`${loja.ativa ? "bg-green-500" : "bg-red-500"} h-5 w-5 rounded-full`}
                ></span>
              </SheetTitle>
              {/* CORREÇÃO AQUI: Adicionado 'asChild' para permitir a <div> */}
              <SheetDescription asChild className="text-gray-50">
                <div className="flex flex-col gap-4 mt-8 h-full">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">
                      Medição mês anterior
                    </span>
                    <Label className="bg-gray-900 rounded-lg p-2 dark:bg-gray-600">
                      {medidor.ultima_leitura}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Medição atual</span>
                    <Label className="bg-gray-900 rounded-lg p-2 dark:bg-gray-600">
                      {formData.medicao_atual}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Gasto no mês</span>
                    <Label
                      className={`bg-gray-900 rounded-lg p-2 dark:bg-gray-600 border-2  border-slate-200 `}
                    >
                      {(formData.medicao_atual - medidor.ultima_leitura) / 100}{" "}
                      {(medidor.tipo_medicao === "Energia" && "kWh") || "m3"}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">
                      Detalhe leitura
                    </span>
                    <Textarea
                      className="text-gray-900 dark:text-gray-50 border border-gray-400 rounded-lg px-2 py-2 bg-white"
                      value={formData.detalhes_leitura || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detalhes_leitura: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    Se sim, clique em **Registrar** para salvar os dados.
                  </div>
                  <div
                    className="text-gray-50 flex-col flex h-full gap-4 mt-
                  auto"
                  >
                    {isPending ? (
                      <ButtonLoading />
                    ) : (
                      <Button
                        className="w-full mt-auto"
                        onClick={handleFinalSubmit}
                        variant={"outline"}
                        disabled={isPending}
                      >
                        Registrar
                      </Button>
                    )}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
