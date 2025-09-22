"use client";
import { useState } from "react";
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

export default function ExportExcel() {
  const {
    month,
    year,
    typeMedicao = "Energia",
    setTypeMedicao,
  } = useAppContext();
  const { data } = useFetchLojaTabela(typeMedicao, month, year);
  const [activeLeituras, setActiveLeituras] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);
  console.log(month, year, typeMedicao);

  console.log(data);
  return (
    <Content title="Lista ">
      <section className="items-end gap-12  mt-8 flex float-left">
        <InputDate />
        <div className="w-40 h-full flex items-end ">
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
      </section>
      <div className="mt-4 py-4 text-lg flex gap-4 font-semibold w-full justify-start pr-9">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>
      </div>
      <div></div>
    </Content>
  );
}
