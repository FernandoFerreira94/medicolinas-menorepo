import Image from "next/image";
import Logo from "../../assets/Logo.png";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";
import { Label } from "@repo/ui";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

export default function RecoverRegistration() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#3D3C6C] relative">
      <Link
        href="/"
        className="absolute top-6 left-12 text-white cursor-pointer"
      >
        <IoIosArrowBack
          size={40}
          className="absolute top-6 left-12 text-white cursor-pointer transition duration-300 hover:scale-110 border-3 rounded-lg"
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
        <form className="flex flex-col w-10/12 px-2 mt-4 gap-4 max-sm:w-11/12">
          <Label
            htmlFor="matricula"
            className="pl-1 flex flex-col max-sm:text-basic"
          >
            Nome completo
          </Label>
          <Input
            placeholder="Digite seu nome completo"
            type="text"
            id="name"
            name="name"
            className="max-sm:text-sm max-sm:h-12"
          />

          <Button type="submit">Verificar</Button>
          <Label htmlFor="matricula">
            N Matricula: <span>1234567</span>
          </Label>
        </form>
      </div>
    </main>
  );
}
