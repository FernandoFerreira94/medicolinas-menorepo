import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { LojaComMedidores } from "@repo/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/src/app/context/useAppContext";
import { toast } from "sonner";
import { useCreateLeitura } from "@repo/utils";
import { ButtonLoading } from "@/components/ui/buttonLoading";

export function Card({ loja }: { loja: LojaComMedidores }) {
  const { firstName, user, month, year, typeMedicao, localidade, searchQuery } =
    useAppContext();
  const { mutate, isPending } = useCreateLeitura(
    typeMedicao,
    month,
    year,
    localidade,
    searchQuery
  );
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
    console.log(loja);
    if (!formData.medicao_atual || formData.medicao_atual <= 0) {
      toast.info("Por favor, preencha a medição atual com um valor válido.");
      return;
    }

    if (formData.medicao_atual < medidor.ultima_leitura) {
      toast.warning("A medição atual deve ser maior ou igual ao anterior.");
      return;
    }

    setIsFormSheetOpen(false);
    setIsConfirmSheetOpen(true);
  };

  const handleFinalSubmit = () => {
    if (verif && formData.detalhes_leitura === "") {
      toast.warning("Se nao souber, coloque não sei e informe o coordenador.");
      return;
    }
    const new_leitura = {
      medidor_id: medidor.id,
      mes: month,
      ano: year,
      leitura_anterior: medidor.ultima_leitura,
      leitura_atual: formData.medicao_atual,
      consumo_mensal: formData.medicao_atual - medidor.ultima_leitura,
      foto_url: null,
      lida_por_usuario_id: user.user_id,
      nome_usuario: `${firstName} - ${user.funcao}`,
      detalhes_leitura: formData.detalhes_leitura,
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

  const verifiGasto = () => {
    // Define um limite de consumo mensal aceitável
    const limiteConsumoAlto = 800; // Altere este valor conforme a necessidade

    // Calcula o consumo mensal
    const consumoMensal = formData.medicao_atual - medidor.ultima_leitura;

    // Retorna true se o consumo for maior que o limite, caso contrário, retorna false
    return consumoMensal > limiteConsumoAlto;
  };

  const verif = verifiGasto();

  return (
    <div
      className={`border-l-8  ${isMedidorVerified ? "border-green-500" : "border-red-500"} flex flex-col w-75 h-45 gap-1 justify-between py-2 px-4 rounded-xl text-gray-900 dark:text-gray-50
      bg-white dark:bg-[#151526] hover:shadow-[2px_2px_10px_4px_#A7B3C3,-2px_-2px_10px_#FFFFFF] transition-shadow duration-300 shadow-xl`}
      key={loja.id}
    >
      <div className="w-full flex justify-between">
        <span className="text-lg font-semibold">{loja.nome_loja}</span>
        <div className="flex gap-2">
          <span className="text-lg font-semibold">
            {loja.prefixo_loja} - {loja.numero_loja}
          </span>
          <span
            className={`${loja.ativa ? "bg-green-500" : "bg-red-500"} rounded-full my-1.5 px-2`}
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
        <span>Medição atual</span>
        <span>
          {isMedidorVerified ? medidor.leituras[0]?.leitura_atual : "-- -- --"}
        </span>
      </div>

      <div className="w-full flex justify-between gap-6">
        <Button variant="outline" className="h-8 w-full">
          Info
        </Button>

        {/* --- Primeiro Sheet: Formulário de Medição --- */}
        <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full h-8 ">Medição</Button>
          </SheetTrigger>
          <SheetContent className="w-8/12">
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold">
                Registrar medição
              </SheetTitle>
              <SheetTitle className="flex justify-between items-center mt-4">
                <span className="text-lg font-medium">
                  {loja.nome_loja} - {loja.numero_loja}
                </span>
                <span
                  className={`${loja.ativa ? "bg-green-500" : "bg-red-500"} h-5 w-5 rounded-full`}
                ></span>
              </SheetTitle>

              <SheetDescription asChild className="text-gray-50">
                <div className="text-gray-50 flex-col flex gap-4 mt-8">
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

                  <Button
                    onClick={handleNextStep}
                    className="w-full mt-4"
                    variant={"outline"}
                  >
                    Registrar medição
                  </Button>
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
                <div className="flex flex-col gap-4 mt-8">
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
                      className={`bg-gray-900 rounded-lg p-2 dark:bg-gray-600 border-1  ${verif ? "border-red-500" : "border-green-500"} `}
                    >
                      {formData.medicao_atual - medidor.ultima_leitura}
                    </Label>
                    {verif && (
                      <>
                        <small className="text-[14px] text-red-500 ">
                          O consumo foi alto nesse mês, coloque o motivo
                        </small>
                        <Textarea
                          className={`text-gray-100 border ${formData.detalhes_leitura === "" && "border-red-500"}`}
                          placeholder="Digite o motivo"
                          required
                          value={formData.detalhes_leitura}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              detalhes_leitura: e.target.value,
                            })
                          }
                        />
                      </>
                    )}
                  </div>
                  <div className="mt-4">
                    Se sim, clique em **Registrar** para salvar os dados.
                  </div>
                  <div className="text-gray-50 flex-col flex gap-4 mt-8">
                    {isPending ? (
                      <ButtonLoading />
                    ) : (
                      <Button
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
