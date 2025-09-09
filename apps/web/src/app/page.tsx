"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/src/assets/Logo.png";
import LogoWhite from "@/src/assets/LogoWhite.png";
//import { Input } from "../componente/Input";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "../components/label";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Espera 2s -> inicia fade-out
    const timer = setTimeout(() => {
      setFadeOut(true);

      // Espera mais 0.5s -> remove splash do DOM
      setTimeout(() => setIsVisible(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-[#3D3C6C] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } z-50`}
    >
      <Image
        src={LogoWhite}
        alt="Logo"
        width={400}
        height={400}
        className="max-sm:w-9/12"
      />
    </div>
  );
}

export default function Login() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const matricula = formData.get("matricula");
    const password = formData.get("password");

    const data = { matricula, password };
    console.log(data);

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#3D3C6C] relative">
      <div
        className="border w-3/12 min-w-140 h-full bg-gray-50 rounded-2xl flex flex-col items-center py-12 
        max-sm:min-w-10/12 max-sm:py-8"
      >
        <Image
          src={Logo}
          alt="Logo"
          width={300}
          height={300}
          className="max-sm:w-10/12"
        />
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
            <Link
              href="/recoverRegistration"
              className="text-gray-500 text-sm font-normal w-full text-end transition duration-300 hover:text-cyan-600"
            >
              Esqueceu número da matrícula?
            </Link>
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
            <Link
              href="/recoverPassword"
              className="text-gray-500 text-sm w-full font-normal text-end transition duration-300 hover:text-cyan-600"
            >
              Esqueceu a senha?
            </Link>
          </Label>

          <Button type="submit">Acessar</Button>
        </form>
      </div>

      {/* SplashScreen aparece sobre a tela de login */}
      <SplashScreen />
    </main>
  );
}
