import Image from "next/image";
import {
  TbUserEdit,
  TbHomeEdit,
  TbHomePlus,
  TbTable,
  TbUserCircle,
  TbFileExcel,
  TbLogout2,
} from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbUserPlus } from "react-icons/tb";
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

import { useAppContext } from "../../context/useAppContext";
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

  const user = data?.user;

  return (
    <nav
      className={`fixed top-0 rounded-tr-[16px] rounded-br-[16px]  flex flex-col items-center h-screen bg-[${roxoPrimary}] dark:bg-[${roxoDark}]  shadow-md transition-all duration-800 
        ${showSideBar ? "w-60 " : "w-16 "}
          
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

      <ul className=" flex flex-col h-full w-full  text-[17px] py-3 ">
        <Li title="Painel">
          <Link
            href="/medicao"
            className={`w-full h-full flex items-center pl-1 gap-2 ${
              showSideBar ? "justify-start " : "justify-center"
            }`}
          >
            <TbTable size={22} />
            {showSideBar && <span>Painel</span>}
          </Link>
        </Li>

        {user?.is_adm && (
          <>
            <Li title="Cadastrar loja">
              <Link
                href="/registerStore"
                className={`w-full h-full flex items-center pl-1  gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <TbHomePlus size={26} className="text-gray-100 " />{" "}
                {showSideBar && <span>Cadastrar loja</span>}
              </Link>
            </Li>
            <Li title="Editar loja">
              <Link
                href="/editStore"
                className={`w-full h-full flex items-center pl-1  gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <TbHomeEdit size={26} className="text-gray-100 " />{" "}
                {showSideBar && <span>Editar loja</span>}
              </Link>
            </Li>

            <Li title="Cadastrar usuário">
              <Link
                href="/registerUser"
                className={`w-full h-full flex items-center   gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <TbUserPlus size={32} className={`text-gray-50 `} />{" "}
                {showSideBar && (
                  <div>
                    <p>Cadastrar usuário</p>
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
                    <TbUserEdit size={32} className="text-gray-100" />{" "}
                    {showSideBar && <span>Editar usuário</span>}
                  </div>
                </SheetTrigger>
                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetTitle>Selecione o usuario</SheetTitle>
                    <SheetTitle className="w-full flex justify-between px-4 my-2">
                      <span>Nome</span>Função
                    </SheetTitle>
                    <SheetDescription className="w-full flex flex-col  gap-4 pt-4">
                      {userAll?.map((user) => (
                        <Button
                          key={user.user_id}
                          variant={"outline"}
                          className="w-full "
                        >
                          <Link
                            href={`/editUser/${user.user_id}`}
                            className="w-full h-full flex justify-between items-center px-4"
                          >
                            <span title={user.nome_completo}>
                              {user.nome_completo.length > 15
                                ? user.nome_completo.slice(0, 20) + "..."
                                : user.nome_completo}
                            </span>
                            <span title={user.funcao}>{user.funcao}</span>
                          </Link>
                        </Button>
                      ))}
                    </SheetDescription>
                  </SheetHeader>
                  {/* ... conteúdo da Sheet de edição ... */}
                </SheetContent>
              </Sheet>
            </Li>

            <Li title="Exportar Excel">
              <Link
                href="/exportExcel"
                className={`w-full h-full flex items-center pl-1 gap-2 ${
                  showSideBar ? "justify-start " : "justify-center"
                }`}
              >
                <TbFileExcel size={24} />
                {showSideBar && <span>Exporta PDF</span>}
              </Link>
            </Li>
          </>
        )}

        <Li title="Perfil">
          <Link
            href="/profile"
            className={`w-full h-full flex items-center  pl-1 gap-2 ${
              showSideBar ? "justify-start " : "justify-center"
            }`}
          >
            <TbUserCircle size={24} className="text-gray-100" />{" "}
            {showSideBar && <span>Perfil</span>}
          </Link>
        </Li>

        <Li
          title="Sair"
          className="mt-auto mb-4 bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 flex justify-center "
        >
          <button
            onClick={handleLogout}
            className=" h-full flex items-center gap-2 w-full justify-center  cursor-pointer"
          >
            <TbLogout2 size={26} className="text-gray-100   " />
            {showSideBar && <span>Sair</span>}
          </button>
        </Li>
      </ul>
    </nav>
  );
}
