// src/pages/RecoverRegistration.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "../../assets/Logo.png";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { recoverRegistration } from "@repo/utils";
import { toast } from "sonner";

// Função para normalizar o nome
const normalizeName = (name: string): string => {
  if (!name) return "";

  const wordsToExclude = ["de", "da", "do", "dos", "das"];

  // Converte a string para minúsculas e divide em palavras
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      
      if (wordsToExclude.includes(word)) {
        return word;
      }
      // Caso contrário, retorna a primeira letra maiúscula e o resto da palavra
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" "); // Junta as palavras novamente em uma string
};

export default function RecoverRegistration() {
  const [matricula, setMatricula] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nome_completo = formData.get("nome_completo") as string;

    // AQUI: Normalize o nome antes de chamar a função de busca
    const normalizedName = normalizeName(nome_completo);
    console.log(normalizedName);

    const result = await recoverRegistration(normalizedName);
    if (result) {
      setMatricula(result);
    } else {
      toast("Usuário não encontrado!");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#3D3C6C] relative">
      <Link
        href="/"
        className="absolute top-6 left-12 text-white cursor-pointer"
      >
        <IoIosArrowBack
          size={40}
          className="transition duration-300 hover:scale-110 border-3 rounded-lg"
        />
      </Link>

      <div
        className="border w-4/12 min-w-180 h-full bg-gray-50 rounded-2xl flex flex-col items-center py-12 
        max-sm:min-w-10/12 max-sm:py-8"
      >
        <Image
          src={Logo}
          alt="Logo"
          width={400}
          height={400}
          className="max-sm:w-9/12"
        />
        <form
          className="flex flex-col w-10/12 px-2 mt-4 gap-4 max-sm:w-11/12"
          onSubmit={handleSubmit}
        >
          <Label htmlFor="nome_completo">Nome completo</Label>
          <Input
            placeholder="Digite seu nome completo"
            type="text"
            id="nome_completo"
            name="nome_completo"
            required
          />

          <Button type="submit">Verificar</Button>
          {matricula && (
            <Label htmlFor="matricula" className="text-lg ">
              Nº Matricula:
              <span className="text-basic"> {matricula}</span>
            </Label>
          )}
        </form>
      </div>
    </main>
  );
}
