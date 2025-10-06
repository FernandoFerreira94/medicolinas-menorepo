"use client";
import { useEffect, useState, useRef } from "react";
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
import {
  useFetchLojaTabela,
  useCreateCusto,
  useFechCusto,
  useUpdateCusto,
} from "@repo/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabela } from "./calculoTable/tabela";
import { calcularSomaEnergia } from "./calculoTable/action/SomaEnergia";
import { calculoValorPagar } from "./calculoTable/action/ValorPagar";
import { totalGeralFormatado } from "./calculoTable/action/valorFormatado";

export default function ExportExcel() {
  const { month, year, typeMedicao, setTypeMedicao } = useAppContext();
  const custoRateioRef = useRef<HTMLInputElement>(null);

  const { data } = useFetchLojaTabela(typeMedicao, month, year);
  const { data: dataCusto } = useFechCusto({
    mes_custo: month,
    ano_custo: year,
    tipo_custo: typeMedicao,
  });
  const { mutate } = useCreateCusto();
  const { mutate: mutateCusto } = useUpdateCusto();
  const somaTotalEnergia = calcularSomaEnergia(data);
  console.log(somaTotalEnergia);

  const [activeLeituras, setActiveLeituras] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);
  /*
  useEffect(() => {
    if (dataCusto) {
      custoRateioRef.current.value = dataCusto?.valor_custo;
    } else {
      custoRateioRef.current.value = "";
    }
  }, [dataCusto, typeMedicao, month, year]);
 */
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
  }, [data]);
  /*
  function handleCustoRateio() {
    const newCusto = {
      valor_custo: Number(custoRateioRef.current?.value), // Converte para número se for uma stringcustoRateio,
      mes_custo: month,
      ano_custo: year,
      tipo_custo: typeMedicao,
    };

    if (newCusto.valor_custo === 0) {
      toast.warning("Por favor, preencha o custo.");
      return;
    }

    mutate(newCusto);
  }

  function handleEditCusto() {
    const editCusto = {
      valor_custo: Number(custoRateioRef.current?.value), // Converte para número se for uma stringcustoRateio,
    };

    if (dataCusto?.valor_custo === custoRateioRef) {
      toast.warning("Por favor, modifique o custo caso queira alterar.");
      return;
    }

    mutateCusto({
      filtro: {
        mes_custo: month,
        ano_custo: year,
        tipo_custo: typeMedicao,
      },
      payload: editCusto,
    });
  }

  function handleExportExcel() {
    if (
      custoRateioRef.current?.value === "" ||
      custoRateioRef === null ||
      custoRateioRef === undefined
    )
      toast.warning("Por favor, preencha o campo Custo Unitário.");
    custoRateioRef.current?.focus();
    return;
  }

  function Span({ text }: { text: string }) {
    return (
      <span
        className="w-full border py-2 px-4 rounded-lg font-normal bg-white border-gray-600 text-gray-900
       dark:bg-[#151526] dark:text-gray-50"
      >
        {text}
      </span>
    );
  }

  function SpanLabel({ children }: { children: React.ReactNode }) {
    return (
      <span className="flex items-center gap-2 font-medium">{children}</span>
    );
  }

  const unit = () => {
    if (typeMedicao !== "Energia") return "M3";
    else {
      return "Kwh";
    }
  };

  const valorPagarEspacoRelogio = totalGeralFormatado(
    calculoValorPagar(
      Number(custoRateioRef.current?.value),
      somaTotalEnergia.totalEspacoRelogio
    )
  );

  const valorPagarTotal = (valor: number) => {
    const result = calculoValorPagar(
      Number(custoRateioRef.current?.value),
      valor
    );

    return totalGeralFormatado(result);
  };
 */
  return (
    <Content title="Tabela de consumo ">
      <section className="items-end  mt-8 flex w-full">
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
        {/* 
        <div className="w-full flex  ">
          <Button
            className="w-80 ml-auto mr-8"
            variant={"default"}
            onClick={handleExportExcel}
          >{`Export Leitura ${typeMedicao} - ${month}/${year}`}</Button>
        </div>
        */}
      </section>

      {/* 
      <h3 className="font-semibold text-xl">Medição shopping</h3>
      <span className="text-base flex items-center gap-4 mt-2">
    
        Custo Unitário Conta/Rateio:
        <div className="relative">
          <Input
            ref={custoRateioRef}
            placeholder="Informe o valor a cobrar"
            title="Digite o custo da cobrança"
            className="w-50  h-12 relative text-gray-900 dark:text-gray-50 "
            type="number"
          />{" "}
          {dataCusto !== undefined && (
            <span className="text-sm absolute right-10 top-4 text-gray-400">
              R$
              </span>
          )}
        </div>
        {dataCusto === undefined ? (
          <Button onClick={handleCustoRateio} className="w-30 h-9">
            Registrar valor
          </Button>
        ) : (
          <Button onClick={handleEditCusto} className="w-30 h-9">
            Editar valor
          </Button>
        )}
      </span>
           
      <div className="w-full grid grid-cols-5  gap-12 mt-4 mb-4 items-center justify-start">
        <div className="grid gap-4 ">
          <h3 className="font-semibold text-lg">Consumo {unit()}</h3>
          <SpanLabel>
            Total Espaço (Relogios) {unit()} :{" "}
            <Span
              text={
                (typeMedicao === "Energia" &&
                  totalGeralFormatado(somaTotalEnergia.totalEspacoRelogio)) ||
                "0"
              }
            />
          </SpanLabel>
          <SpanLabel>
            Total Central de Ar Condicionado {unit()}:
            <Span
              text={
                (typeMedicao === "Energia" &&
                  totalGeralFormatado(somaTotalEnergia.totalArCondicionado)) ||
                "0"
              }
            />
          </SpanLabel>
          <SpanLabel>
            Valor Geral Raterio {unit()}:
            <Span
              text={
                (typeMedicao === "Energia" &&
                  totalGeralFormatado(somaTotalEnergia.totalGeral)) ||
                " 0"
              }
            />
          </SpanLabel>
        </div>
        <div className="grid  gap-4 ">
          <h3 className="font-semibold text-lg">Valor total</h3>
          <SpanLabel>
            Total Espaço (Relogios) :{" "}
            <Span
              text={
                (typeMedicao === "Energia" &&
                  valorPagarTotal(somaTotalEnergia.totalEspacoRelogio)) ||
                "0"
              }
            />
          </SpanLabel>
          <SpanLabel>
            Total Central de Ar Condicionado :
            <Span
              text={
                (typeMedicao === "Energia" &&
                  valorPagarTotal(somaTotalEnergia.totalArCondicionado)) ||
                "0"
              }
            />
          </SpanLabel>
          <SpanLabel>
            Valor Geral Raterio{" "}
            <Span
              text={
                (typeMedicao === "Energia" &&
                  valorPagarTotal(somaTotalEnergia.totalGeral)) ||
                "0"
              }
            />
          </SpanLabel>
        </div>
        <div className="grid gap-4 ">
          <h3 className="font-semibold text-lg">%Varl</h3>
          <SpanLabel>
            Total Espaço (Relogios) : <Span text={"4"} />
          </SpanLabel>
          <SpanLabel>
            Valor Geral Raterio <Span text={"4"} />
          </SpanLabel>
          <SpanLabel>
            Total Central de Ar Condicionado:
            <Span text={"4"} />
          </SpanLabel>
        </div>
      </div>
       */}
      <div className="w-full flex gap-12 my-3">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400 ">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>
      </div>
      <div className=" w-full h-full ">
        <Tabela custoRateioRef={Number(custoRateioRef.current?.value)} />
      </div>
    </Content>
  );
}
