"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { SplashScreen } from "../_componente/splashScreen";
import Logo from "@/src/assets/Logo.png";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { ButtonLoading } from "../../components/ui/buttonLoading";
import { useAppContext } from "./context/useAppContext";
import Cookie from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { recoverRegistration, normalizeName, useSignIn } from "@repo/utils";

export default function Login() {
  const { setToken } = useAppContext();
  const [matriculaVerufy, setMatriculaVerufy] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useSignIn({
    onSuccess: (data) => {
      setToken(data.session.access_token);
      Cookie.set("auth_token", data.session.access_token, { expires: 7 });

      router.push("/medicao");
    },
    onError: (error) => {
      alert(`Erro no login: ${error.message}`);
      setToken(null);

      Cookie.set("auth_token", "", { expires: 7 });
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    //const matricula = formData.get("matricula") as string;
    //const password = formData.get("password") as string;
    const matricula = "123456";
    const password = "454184";

    if (!matricula || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    mutate({ matricula, password });
  }

  async function handleVerify() {
    const result = await recoverRegistration(nomeCompleto);
    if (result) {
      setMatriculaVerufy(result);
    } else {
      toast("Usuário não encontrado!");
      setMatriculaVerufy("");
    }
  }

  const handleCopyMatricula = () => {
    if (typeof window !== "undefined" && matriculaVerufy) {
      navigator.clipboard
        .writeText(matriculaVerufy)
        .then(() => {
          toast.success("Matrícula copiada com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao copiar a matrícula: ", err);
          toast.error("Erro ao copiar a matrícula.");
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#3D3C6C] relative">
      <div
        className="border w-3/12 min-w-140 h-full bg-gray-50 rounded-2xl flex flex-col items-center py-12 
        max-sm:min-w-10/12 max-sm:py-8"
      >
        <div className="relative w-full h-[150px] max-sm:w-10/12 mb-4">
          <Image
            src={Logo}
            alt="Logo"
            priority
            fill
            style={{ objectFit: "contain" }}
            className="max-sm:w-10/12 "
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-10/12 px-2 gap-2 max-sm:w-11/12"
        >
          <Label
            htmlFor="matricula"
            className="pl-1 flex flex-col gap-1 max-sm:text-basic"
          >
            N° matrícula
            <Input
              placeholder="Digite sua matrícula"
              type="text"
              id="matricula"
              name="matricula"
              className="max-sm:text-sm max-sm:h-12"
            />
            <span className="text-gray-500 text-sm font-normal w-full text-end transition duration-300 hover:text-cyan-600 ">
              <Sheet>
                <SheetTrigger className="cursor-pointer">
                  Esqueceu sua matrícula?
                </SheetTrigger>
                <SheetContent className="w-full">
                  <SheetHeader>
                    <SheetTitle className="mt-4">
                      Digite seu nome completo
                    </SheetTitle>
                    <SheetDescription className="mt-8 flex flex-col gap-4">
                      <Label htmlFor="nome_completo" className="text-gray-50">
                        Nome completo
                      </Label>
                      <Input
                        placeholder="Digite seu nome completo"
                        type="text"
                        id="nome_completo"
                        value={nomeCompleto}
                        onChange={(e) =>
                          setNomeCompleto(normalizeName(e.target.value))
                        }
                        required
                      />
                      <Button
                        className="w-full"
                        variant={"outline"}
                        onClick={handleVerify}
                      >
                        Verificar
                      </Button>

                      {matriculaVerufy && (
                        <Label
                          htmlFor="matricula"
                          className="text-lg  flex flex-col gap-2"
                        >
                          <span className="text-basic text-yellow-500">
                            <span className="text-gray-50 mr-2">
                              {" "}
                              Nº Matricula:
                            </span>
                            {matriculaVerufy}
                          </span>
                          <Button
                            className="w-full bg-[#151526] hover:bg-[#151526]/80 "
                            variant={"default"}
                            onClick={handleCopyMatricula}
                          >
                            Copiar matricula
                          </Button>
                        </Label>
                      )}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </span>
          </Label>

          <Label
            htmlFor="password"
            className="pl-1 flex flex-col gap-1 max-sm:text-basic"
          >
            Senha
            <Input
              placeholder="Digite sua senha"
              type="password"
              id="password"
              name="password"
              className="max-sm:text-sm max-sm:h-12"
            />
          </Label>

          {isPending ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Acessar</Button>
          )}
        </form>
      </div>

      <SplashScreen />
    </main>
  );
}
