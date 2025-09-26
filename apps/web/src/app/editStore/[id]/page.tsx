"use client";
import React, { useState, useRef, useEffect } from "react";
import { Content } from "@/src/_componente/content";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Localidade } from "@/src/_componente/dateTipoMedicao/localidade";

import { useFetchLoja, DetalhesProps } from "@repo/utils";

export default function EditStore({ params }: DetalhesProps) {
  const resolvedParams = React.use(params);
  const { data, isLoading, error } = useFetchLoja(resolvedParams.id);
  const formRef = useRef<HTMLFormElement>(null);

  const [complexo, setComplexo] = useState("Shopping Colinas");
  const [ativa, setAtiva] = useState(true);
  const [energia, setEnergia] = useState(false);
  const [agua, setAgua] = useState(false);
  const [gas, setGas] = useState(false);
  const [prefixo, setPrefixo] = useState("NT");
  const [nome_loja, setNome_loja] = useState("");
  const [localidade_energia, setLocalidade_energia] = useState("");
  const [localidade_agua, setLocalidade_agua] = useState("");
  const [localidade_gas, setLocalidade_gas] = useState("");
  const [numero_loja, setNumero_loja] = useState("");
  const [medidorEnergia, setMedidorEnergia] = useState({
    detalhe: "",
    localidade: "",
    numero_relogio: "",
    quadro_distribuicao: "",
    tipo_medicao: "",
    ultima_leitura: "",
  });
  const [medidorAgua, setMedidorAgua] = useState({
    detalhe: "",
    localidade: "",
    numero_relogio: "",
    tipo_medicao: "",
    ultima_leitura: "",
  });
  const [medidorGas, setMedidorGas] = useState({
    detalhe: "",
    localidade: "",
    numero_relogio: "",

    tipo_medicao: "",
    ultima_leitura: "",
  });

  useEffect(() => {
    if (data) {
      setComplexo(data.complexo);
      setAtiva(data.ativa);
      setPrefixo(data.prefixo_loja);
      setNome_loja(data.nome_loja);
      setNumero_loja(data.numero_loja);

      setEnergia(data.tem_energia);
      setAgua(data.tem_agua);
      setGas(data.tem_gas);

      if (data.medidores) {
        const energiaData = data.medidores.find(
          (m: any) => m.tipo_medicao === "Energia"
        );
        const aguaData = data.medidores.find(
          (m: any) => m.tipo_medicao === "Agua"
        );
        const gasData = data.medidores.find(
          (m: any) => m.tipo_medicao === "Gas"
        );

        setMedidorEnergia(energiaData || null);
        setMedidorAgua(aguaData || null);
        setMedidorGas(gasData || null);
      }
    }
    console.log(medidorEnergia);
  }, [data]);

  console.log(medidorEnergia);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      id: data.id,
      nome_loja,
      prefixo,
      numero_loja,
      complexo,
      ativa,
      medidores: [
        energia ? { ...medidorEnergia, tipo_medicao: "Energia" } : null,
        agua ? { ...medidorAgua, tipo_medicao: "Agua" } : null,
        gas ? { ...medidorGas, tipo_medicao: "Gas" } : null,
      ].filter(Boolean),
    };

    console.log("Payload para update:", payload);
  }

  return (
    <Content
      title={` ${data?.nome_loja} / ${data?.prefixo_loja} - ${data?.numero_loja}`}
    >
      <section className="w-full flex">
        <form
          className="flex flex-col gap-4 mt-8 w-full"
          onSubmit={handleSubmit}
        >
          {/* ... todo o resto do seu formulário ... */}
          <div className="w-xl flex flex-col gap-4 max-2xl:w-8/12">
            <Label>Complexo</Label>
            <Select required value={complexo} onValueChange={setComplexo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shopping Colinas">
                  Shopping Colinas
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativa"
                onCheckedChange={setAtiva}
                checked={ativa}
                name="ativa"
              />
              <Label htmlFor="ativa">Esta loja esta ativa?</Label>
            </div>

            <Label>Loja</Label>
            <Input
              type="text"
              placeholder="Nome da loja"
              id="nome_loja"
              required
              value={nome_loja}
              onChange={(e) => setNome_loja(e.target.value)}
              className="uppercase"
            />

            <Label>Nº loja</Label>
            <Select required value={prefixo} onValueChange={setPrefixo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NS">NS - (Nivel Superior)</SelectItem>
                <SelectItem value="NT">NT - (Nivel Terreo)</SelectItem>
                <SelectItem value="QS">QS - (Quisque Superior)</SelectItem>
                <SelectItem value="QT">QT - (Quisque Terreo)</SelectItem>
                <SelectItem value="QBT">
                  QBT - (Quisque Boulevard Terreo)
                </SelectItem>
                <SelectItem value="QVB">
                  QVB - (Quisque Vitrine Boulevard )
                </SelectItem>
                <SelectItem value="AE">AE - (Area externa)</SelectItem>
                <SelectItem value="AT">AT - (Area Tecnica)</SelectItem>
                <SelectItem value="CE">CE </SelectItem>
                <SelectItem value="D">D - (Deposito)</SelectItem>
                <SelectItem value="EST">EST - (Estacionamento)</SelectItem>
                <SelectItem value="TR">TR - (Torre Comercial)</SelectItem>
                <SelectItem value="CAG">CAG ( Central Agua Gelada )</SelectItem>
                <SelectItem value=" ">outros</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Numero da loja 01"
              id="numero_loja"
              required
              value={numero_loja}
              onChange={(e) => setNumero_loja(e.target.value)}
            />
          </div>

          <div
            className={`w-full ${agua || gas ? "flex-row" : "flex-col"} flex gap-4 max-2xl:flex-col`}
          >
            <div className="flex flex-col gap-4 w-3/10 max-2xl:w-8/12">
              <div className="flex items-center space-x-2">
                <Switch
                  id="energia"
                  onCheckedChange={setEnergia}
                  checked={energia}
                  name="energia"
                />
                <Label htmlFor="energia">Energia</Label>
              </div>

              {energia && (
                <div className="flex flex-col gap-4">
                  <Label>Numero relogio</Label>
                  <Input
                    type="text"
                    placeholder="Numero do relogio"
                    required
                    id="numero_relogio_energia"
                    value={medidorEnergia.numero_relogio}
                    onChange={(e) =>
                      setMedidorEnergia({
                        ...medidorEnergia,
                        numero_relogio: e.target.value,
                      })
                    }
                  />
                  <Label>Localizaçao relogio</Label>
                  <Localidade value={medidorEnergia.localidade} />
                  <Label>Quadro de distribuiçao</Label>
                  <Input
                    type="text"
                    placeholder="Digite o quadro de distribuição"
                    id="quadro_distribuicao"
                    value={medidorEnergia.quadro_distribuicao}
                    onChange={(e) =>
                      setMedidorEnergia({
                        ...medidorEnergia,
                        quadro_distribuicao: e.target.value,
                      })
                    }
                  />
                  <Label>Ultima leitura</Label>
                  <Input
                    type="text"
                    placeholder="Digite a ultima leitura"
                    required
                    id="ultima_leitura_energia"
                    value={medidorEnergia.ultima_leitura}
                    onChange={(e) =>
                      setMedidorEnergia({
                        ...medidorEnergia,
                        ultima_leitura: e.target.value,
                      })
                    }
                  />

                  <Label htmlFor="detalhe_energia">Detalhes</Label>
                  <Textarea
                    placeholder="Adicione algun detalhes necessario"
                    id="detalhe_energia"
                    value={medidorEnergia.detalhe}
                    onChange={(e) =>
                      setMedidorEnergia({
                        ...medidorEnergia,
                        detalhe: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 w-3/10 max-2xl:w-8/12">
              <div className="flex items-center space-x-2">
                <Switch
                  id="agua"
                  onCheckedChange={setAgua}
                  checked={agua}
                  name="agua"
                />
                <Label htmlFor="agua">Agua</Label>
              </div>
              {agua && (
                <div className="flex flex-col gap-4">
                  <Label>Numero relogio</Label>
                  <Input
                    type="text"
                    placeholder="Numero do relogio"
                    required
                    id="numero_relogio_agua"
                    value={medidorAgua.numero_relogio}
                    onChange={(e) =>
                      setMedidorAgua({
                        ...medidorAgua,
                        numero_relogio: e.target.value,
                      })
                    }
                  />
                  <Label>Localizaçao relogio</Label>
                  <Localidade value={medidorAgua.localidade} />
                  <Label>Ultima leitura</Label>
                  <Input
                    type="text"
                    placeholder="Digite a ultima leitura"
                    required
                    id="ultima_leitura_agua"
                    value={medidorAgua.ultima_leitura}
                    onChange={(e) =>
                      setMedidorAgua({
                        ...medidorAgua,
                        ultima_leitura: e.target.value,
                      })
                    }
                  />

                  <Label htmlFor="detalhe_agua">Detalhes</Label>
                  <Textarea
                    placeholder="Adicione algun detalhes necessario"
                    id="detalhe_agua"
                    value={medidorAgua.detalhe}
                    onChange={(e) =>
                      setMedidorAgua({
                        ...medidorAgua,
                        detalhe: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 w-3/10 max-2xl:w-8/12">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gas"
                  onCheckedChange={setGas}
                  checked={gas}
                  name="gas"
                />
                <Label htmlFor="gas">Gás</Label>
              </div>
              {gas && (
                <div className="flex flex-col gap-4">
                  <Label>Numero relogio</Label>
                  <Input
                    type="text"
                    placeholder="Numero do relogio"
                    required
                    id="numero_relogio_gas"
                    value={medidorGas.numero_relogio}
                    onChange={(e) =>
                      setMedidorGas({
                        ...medidorGas,
                        numero_relogio: e.target.value,
                      })
                    }
                  />
                  <Label>Localizaçao relogio</Label>
                  <Localidade
                    value={medidorGas.localidade}
                    setValue={setLocalidade_gas}
                  />
                  <Label>Ultima leitura</Label>
                  <Input
                    type="text"
                    placeholder="Digite a ultima leitura"
                    required
                    id="ultima_leitura_gas"
                    value={medidorGas.ultima_leitura}
                    onChange={(e) =>
                      setMedidorGas({
                        ...medidorGas,
                        ultima_leitura: e.target.value,
                      })
                    }
                  />

                  <Label htmlFor="detalhe_gas">Detalhes</Label>
                  <Textarea
                    placeholder="Adicione algun detalhes necessario"
                    id="detalhe_gas"
                    value={medidorGas.detalhe}
                    onChange={(e) =>
                      setMedidorGas({
                        ...medidorGas,
                        detalhe: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-xl max-2xl:w-8/12">
            <Button type="submit" className="w-full">
              Salvar edicao
            </Button>
          </div>
        </form>
      </section>
    </Content>
  );
}
