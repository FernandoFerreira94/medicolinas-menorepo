"use client";
import { Title } from "@/src/componente/title";
import { Content } from "../../componente/content";
import { DateTipoMedicao } from "@/src/componente/dateTipoMedicao";
import { useAppContext } from "@/src/app/context/useAppContext";
import { Card } from "@/src/componente/card";

export default function Dashboard() {
  const { month, year, typeMedicao } = useAppContext();

  return (
    <Content title="Painel medição">
      <section className="w-full flex ">
        <DateTipoMedicao />
      </section>

      <section className="w-full flex flex-wrap gap-8 mt-16">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </section>
    </Content>
  );
}
