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

  const [activeLeituras, setActiveLeituras] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);

  useEffect(() => {
    if (dataCusto) {
      custoRateioRef.current!.value = dataCusto?.valor_custo;
    } else {
      custoRateioRef.current!.value = "";
    }
  }, [dataCusto, typeMedicao, month, year]);

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

  return (
    <Content title="Lista ">
      <section className="items-end gap-18 mt-8 flex w-full">
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
        <div className="w-full flex  ">
          <Button
            className="w-80 ml-auto mr-8"
            variant={"default"}
            onClick={handleExportExcel}
          >{`Export Leitura ${typeMedicao} - ${month}/${year}`}</Button>
        </div>
      </section>
      <div className="mt-4 py-4 text-lg flex gap-4 font-semibold items-center w-full justify-start pr-9 ">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400 ">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>

        <span className="text-base flex items-center gap-4">
          Custo Unitário Conta/Rateio:
          <div className="relative">
            <Input
              ref={custoRateioRef}
              placeholder="Informe o valor a cobrar"
              title="Digite o custo da cobrança"
              className="w-35  h-9 relative text-gray-900 dark:text-gray-50 "
              type="number"
            />{" "}
            {dataCusto !== undefined && (
              <span className="text-sm absolute right-10 top-2 text-gray-400">
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
      </div>
      <h3 className="font-semibold text-xl">Medição shopping</h3>
      <div className="w-full flex gap-12 my-12">
        <div className="flex flex-col gap-4 ">
          <h3 className="font-semibold text-lg">Consumo {unit()}</h3>
          <SpanLabel>
            Total Espaço (Relogios) {unit()} : <Span text="totalRelogios" />
          </SpanLabel>
          <SpanLabel>
            Valor Geral Raterio {unit()}:
            <Span text="totalRelogios" />
          </SpanLabel>
          <SpanLabel>
            Total Central de Ar Condicionado {unit()}:
            <Span text="totalRelogios" />
          </SpanLabel>
        </div>
        <div className="flex flex-col gap-4 ">
          <h3 className="font-semibold text-lg">Valor total</h3>
          <SpanLabel>
            Total Espaço (Relogios) : <Span text="totalRelogios" />
          </SpanLabel>
          <SpanLabel>
            Valor Geral Raterio <Span text="totalRelogios" />
          </SpanLabel>
          <SpanLabel>
            Total Central de Ar Condicionado :<Span text="totalRelogios" />
          </SpanLabel>
        </div>
        <div className="flex flex-col gap-4 ">
          <h3 className="font-semibold text-lg">%Varl</h3>
          <SpanLabel>
            Total Espaço (Relogios) : <Span text="totalRelogios" />
          </SpanLabel>
          <SpanLabel>
            Valor Geral Raterio <Span text="totalRelogios" />
          </SpanLabel>
          <SpanLabel>
            Total Central de Ar Condicionado :<Span text="totalRelogios" />
          </SpanLabel>
        </div>
      </div>
      <div className=" w-full h-full ">
        <Tabela custoRateioRef={Number(custoRateioRef.current?.value)} />
      </div>
    </Content>
  );
}
