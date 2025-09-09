"use client";
import { useState, useEffect } from "react";
import { Content } from "../../componente/content";
import { Title } from "../../componente/title";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { Switch } from "../../components/switch";
import { Button } from "../../components/button";
import { useSignUp } from "@repo/utils";
import type { UsuarioProps } from "@repo/utils";
import { useAppContext } from "@/src/context/useAppContext";

export default function Register() {
  const [funcao, setFuncao] = useState("");
  const [permissaoEnergia, setPermissaoEnergia] = useState(false);
  const [permissaoAgua, setPermissaoAgua] = useState(false);
  const [permissaoGas, setPermissaoGas] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { setUser } = useAppContext();

  const resetFormFields = () => {
    setFuncao("");
    setPermissaoEnergia(false);
    setPermissaoAgua(false);
    setPermissaoGas(false);
    setIsAdmin(false);
  };
  const { mutate } = useSignUp({
    onSuccess: (data) => {
      resetFormFields();
      setUser(data);
      alert("Cadastro realizado com sucesso!");
      console.log(data);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nome_completo = formData.get("nome_completo") as string;
    const matricula = formData.get("matricula") as string;
    const cpf = formData.get("cpf") as string;

    if (!cpf || cpf.length < 6) {
      alert("A matrícula deve ter no mínimo 6 dígitos.");
      return; // Impede a submissão do formulário
    }

    const userData: UsuarioProps = {
      nome_completo: nome_completo as string,
      cpf: cpf as string,
      matricula: matricula as string,
      funcao,
      is_adm: isAdmin,
      permissao_energia: permissaoEnergia,
      permissao_agua: permissaoAgua,
      permissao_gas: permissaoGas,
    };

    mutate(userData);
  };

  useEffect(() => {
    // Define todas as permissões como falso por padrão para evitar conflitos
    setPermissaoEnergia(false);
    setPermissaoAgua(false);
    setPermissaoGas(false);
    setIsAdmin(false);

    if (funcao === "coordenador" || funcao === "M2") {
      setPermissaoEnergia(true);
      setPermissaoAgua(true);
      setPermissaoGas(true);
      setIsAdmin(true);
    } else if (funcao === "M7" || funcao === "M9") {
      setPermissaoEnergia(true);
      setPermissaoAgua(true);
      setPermissaoGas(true);
    } else if (funcao === "M5") {
      setPermissaoEnergia(true);
    } else if (funcao === "M4") {
      setPermissaoAgua(true);
    } else if (funcao === "bravo") {
      setPermissaoGas(true);
    }
    // Não precisa de um 'else' no final, pois os estados já foram definidos como 'false' no início do hook.
  }, [funcao]);

  return (
    <Content>
      <Title text="Cadastrar Usuário" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-xl gap-4 mt-8"
      >
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="nome_completo">Nome Completo</Label>
          <Input
            placeholder="Digite o nome completo"
            id="nome_completo"
            type="text"
            name="nome_completo"
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="funcao">Função</Label>
          <Select onValueChange={setFuncao} required>
            <SelectTrigger className="">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coordenador">Coordenador</SelectItem>
              <SelectItem value="M2">M2 - Supervisor</SelectItem>
              <SelectItem value="M9">M9 - Eletromecânico</SelectItem>
              <SelectItem value="M7">M7 - Líder</SelectItem>
              <SelectItem value="M5">M5 - Eletricista</SelectItem>
              <SelectItem value="M4">M4 - Serviços Gerais</SelectItem>
              <SelectItem value="bravo">Bombeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="matricula">Número de Matrícula</Label>
          <Input
            placeholder="Digite o número da matrícula"
            id="matricula"
            type="text"
            name="matricula"
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            placeholder="Digite o CPF"
            id="cpf"
            type="text"
            name="cpf"
            required
          />
        </div>
        <Label>Permissões de Medição</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="permissao_energia"
              checked={permissaoEnergia}
              onCheckedChange={setPermissaoEnergia}
            />
            <Label htmlFor="permissao_energia">Energia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="permissao_agua"
              checked={permissaoAgua}
              onCheckedChange={setPermissaoAgua}
            />
            <Label htmlFor="permissao_agua">Água</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="permissao_gas"
              checked={permissaoGas}
              onCheckedChange={setPermissaoGas}
            />
            <Label htmlFor="permisssao_gas">Gás</Label>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch id="isAdmin" checked={isAdmin} onCheckedChange={setIsAdmin} />
          <Label htmlFor="isAdmin">Usuário Administrador</Label>
        </div>
        <Button type="submit" variant="default">
          Cadastrar
        </Button>
      </form>
    </Content>
  );
}
