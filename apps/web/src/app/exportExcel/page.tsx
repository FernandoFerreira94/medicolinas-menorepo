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
  // data?.medidores[0].leituras[0]?.consumo_mensal;

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
      <div className="border w-full h-full">
        {" "}
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#151526]">Id</TableHead>
              <TableHead>Nome fantasia</TableHead>
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
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium bg-[#151526]">
                    {item.prefixo_loja} - {item.numero_loja}
                  </TableCell>
                  <TableCell>{item.nome_loja}</TableCell>
                  <TableCell>{item.medidores[0].numero_relogio}</TableCell>
                  <TableCell>
                    {item.medidores[0]?.leituras[0]?.leitura_anterior ||
                      "mes anterior"}
                  </TableCell>
                  <TableCell>
                    {item.medidores[0]?.leituras[0]?.leitura_atual ||
                      "mes referente"}
                  </TableCell>
                  <TableCell>
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
                    {item.medidores[0]?.leituras[0]?.consumo_mensal * 0.62}
                  </TableCell>
                  <TableCell>{"-9,5%"}</TableCell>
                  <TableCell>{}</TableCell>
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
      </div>
    </Content>
  );
}
