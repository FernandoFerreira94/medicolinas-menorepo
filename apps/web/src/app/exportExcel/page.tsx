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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    setTypeMedicao("Energia");
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

  console.log(data);

  const consumoMensal = (valor: number) => {
    const consumoMensal = valor * 0.62;
    return consumoMensal.toFixed(2);
  };

  return (
    <Content title="Lista ">
      <section className="items-end gap-12 mt-8 flex   w-full">
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
        <div className="w-full  flex justify-end">
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
      <div className=" w-full h-full">
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <Table className="bg-white  dark:bg-[#2B2B41] text-lg">
            <TableHeader>
              <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C] ">
                <TableHead>EUC</TableHead>
                <TableHead className="w-20">Nome fantasia</TableHead>
                <TableHead>Relogio</TableHead>
                <TableHead>leitura mês anterior</TableHead>
                <TableHead>leitura mês ref</TableHead>
                <TableHead>consumo mês anterior</TableHead>
                <TableHead>consumo mês ref</TableHead>
                <TableHead>%Var</TableHead>
                <TableHead>Energia pagar mes anterior</TableHead>
                <TableHead>Energia pagar mes ref</TableHead>
                <TableHead>Energia &Var</TableHead>
                <TableHead>C/Taxa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data
                  .sort((a, b) => {
                    const customOrder = [
                      "AE",
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
                    ];
                    const aPrefix = a.prefixo_loja;
                    const bPrefix = b.prefixo_loja;

                    const aIndex = customOrder.indexOf(aPrefix);
                    const bIndex = customOrder.indexOf(bPrefix);

                    if (aIndex !== bIndex) {
                      return aIndex - bIndex;
                    }

                    return a.numero_loja.localeCompare(b.numero_loja);
                  })
                  .map((item) => (
                    <TableRow
                      key={item.id}
                      className={`${!item.ativa && "bg-gray-200"} `}
                    >
                      <TableCell className="font-semibold ">
                        {item.prefixo_loja} - {item.numero_loja}
                      </TableCell>
                      <TableCell className="w-20 ">{item.nome_loja}</TableCell>
                      <TableCell>{item.medidores[0].numero_relogio}</TableCell>
                      <TableCell className="text-center">
                        {item.medidores[0]?.leituras[0]?.leitura_anterior ||
                          "mes anterior"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.medidores[0]?.leituras[0]?.leitura_atual ||
                          "mes referente"}
                      </TableCell>
                      <TableCell className="">
                        {item.medidores[0]?.leituras[0]?.consumo_anterior ||
                          "consumo mes anterior"}
                      </TableCell>
                      <TableCell>
                        {item.medidores[0]?.leituras[0]?.consumo_mensal ||
                          "consumo atual"}
                      </TableCell>
                      <TableCell>
                        {item.medidores[0]?.leituras[0]?.consumo_mensal || "8%"}
                      </TableCell>
                      <TableCell>{"consumo que pago mes anterior"}</TableCell>
                      <TableCell>
                        {consumoMensal(
                          item.medidores[0]?.leituras[0]?.consumo_mensal
                        )}
                      </TableCell>
                      <TableCell>{"-9,5%"}</TableCell>
                      <TableCell className="">{"484"}</TableCell>
                    </TableRow>
                  ))}
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
