import Image from "next/image";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { MdStore } from "react-icons/md";
import { FaUserAlt, FaUserCircle } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdAddBusiness } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAppContext } from "../../app/context/useAppContext";
import { Li } from "../../_componente/Li";
import LogoI from "../../assets/IconsIwhite.png";
import Logo from "../../assets/LogoWhite.png";
import {
  roxoPrimary,
  roxoDark,
  useFetchUser,
  useFetchAllUsers,
} from "@repo/utils";
import { Button } from "@/components/ui/button";

export function SideBar() {
  const { showSideBar, setUser } = useAppContext();
  const router = useRouter();
  const { setTheme } = useTheme();
  function handleLogout() {
    setUser(null);
    Cookies.remove("auth_token");
    router.push("/");
    setTheme("light");
  }

  const { data } = useFetchUser();
  const { data: userAll } = useFetchAllUsers();

  if (!data) {
    return <>Buscando usuario</>;
  }

  console.log(userAll);
  const user = data.user;

  return (
    <nav
      className={`fixed top-0 rounded-tr-[16px] rounded-br-[16px]  flex flex-col items-center h-screen bg-[${roxoPrimary}] dark:bg-[${roxoDark}]  shadow-md transition-all duration-800 
        ${showSideBar ? "w-42 " : "w-16 "}
          
      }`}
    >
      <div className="mt-4">
        {showSideBar ? (
          <Image
            src={Logo}
            alt="Logo"
            width={130}
            height={130}
            className="mt-6"
          />
        ) : (
          <Image
            src={LogoI}
            alt="Logo"
            width={40}
            height={40}
            className="mt-6"
          />
        )}
      </div>

      <ul className=" flex flex-col h-full w-full items-center text-basic py-3 ">
        <Li title="Painel">
          <Link
            href="/medicao"
            className={`w-full h-full flex items-center  gap-2 ${
              showSideBar ? "justify-start " : "justify-center"
            }`}
          >
            <BsMenuButtonWideFill size={22} />
            {showSideBar && <span>Painel</span>}
          </Link>
        </Li>

        {user?.is_adm && (
          <>
            <Li title="Cadastrar loja">
              <Link
                href="/registerStore"
                className={`w-full h-full flex items-center  gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <MdAddBusiness size={26} className="text-gray-100 " />{" "}
                {showSideBar && <span>Cadastrar loja</span>}
              </Link>
            </Li>
            <Li title="Editar loja">
              <MdStore size={26} className="text-gray-100 " />{" "}
              {showSideBar && <span>Editar loja</span>}
            </Li>
            <Li title="Cadastrar usuário">
              <Link
                href="/registerUser"
                className={`w-full h-full flex items-center  gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <TiUserAdd
                  className={`text-gray-50 ${
                    showSideBar ? "text-[30px]" : "text-3xl"
                  }`}
                />{" "}
                {showSideBar && (
                  <div>
                    <p>Cadastrar </p> <p>usuário</p>
                  </div>
                )}
              </Link>
            </Li>

            <Li title="Editar usuário">
              <Sheet>
                <SheetTrigger asChild>
                  <div
                    className={`w-full h-full flex items-center  gap-2 ${
                      showSideBar ? "justify-start " : "justify-center"
                    }`}
                  >
                    <FaUserAlt size={24} className="text-gray-100" />{" "}
                    {showSideBar && <span>Editar usuário</span>}
                  </div>
                </SheetTrigger>
                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetTitle>Selecione o usuario</SheetTitle>
                    <SheetTitle className="w-full flex justify-between px-4 my-2">
                      <span>{}</span>Função
                    </SheetTitle>
                    <SheetDescription>
                      {userAll?.map((user) => (
                        <Button
                          key={user.id}
                          variant={"ghost"}
                          className="w-full text-gray-50 border flex justify-between px-4"
                        >
                          <span>{user.nome_completo} </span>
                          <span>{user.funcao}</span>
                        </Button>
                      ))}
                    </SheetDescription>
                  </SheetHeader>
                  {/* ... conteúdo da Sheet de edição ... */}
                </SheetContent>
              </Sheet>
            </Li>

            <Li title="Exportar PDF">
              <Link
                href="/dashboard"
                className={`w-full h-full flex items-center  gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <FaFilePdf size={24} />
                {showSideBar && <span>Exporta PDF</span>}
              </Link>
            </Li>
          </>
        )}

        <Li title="Perfil">
          <FaUserCircle size={24} className="text-gray-100" />{" "}
          {showSideBar && <span>Perfil</span>}
        </Li>

        <Li
          title="Sair"
          className="mt-auto mb-4 bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 flex justify-center "
        >
          <button
            onClick={handleLogout}
            className=" h-full flex items-center gap-2 w-full justify-center  cursor-pointer"
          >
            <IoLogOut size={26} className="text-gray-100   " />
            {showSideBar && <span>Sair</span>}
          </button>
        </Li>
      </ul>
    </nav>
  );
}
