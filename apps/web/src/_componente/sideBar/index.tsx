// apps/web/src/_componente/sideBar.tsx

"use client";
import Image from "next/image";
import {
  TbUserEdit,
  TbHomeEdit,
  TbHomePlus,
  TbTable,
  TbUserCircle,
  TbFileExcel,
  TbLogout2,
  TbUserPlus,
} from "react-icons/tb";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
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
// import { Li } from "../../_componente/Li"; // Não precisaremos mais do componente Li, ele será embutido
import LogoI from "../../assets/IconsIwhite.png";
import Logo from "../../assets/LogoWhite.png";
import {
  roxoPrimary,
  roxoDark,
  useFetchUser,
  useFetchAllUsers,
} from "@repo/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // Adicionado useEffect e useState

// Adicione as props isMobile e onClose para o menu mobile
export function SideBar({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const { showSideBar, setUser } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();
  const { setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Estado para controlar a Sheet

  function handleLogout() {
    setUser(null);
    Cookies.remove("auth_token");
    router.push("/");
    setTheme("light");
    if (onClose) onClose(); // Fecha o menu mobile se estiver aberto
  }

  const { data } = useFetchUser();
  const { data: userAll } = useFetchAllUsers();
  const user = data?.user;

  // Renderiza a SideBar apenas no mobile quando showMobileMenu for true
  // Ou sempre no desktop
  // As classes CSS base para a nav serão ajustadas para o novo modelo
  const baseNavClass = `fixed top-0 left-0 h-screen bg-[${roxoPrimary}] dark:bg-[${roxoDark}] rounded-tr-[16px] rounded-br-[16px] shadow-md transition-all duration-300 z-30 flex flex-col`; // Removido rounded-tr/br-[16px] para se adaptar melhor ao mobile
  const desktopWidthClass = showSideBar ? "w-55" : "w-16 items-center";
  const mobileClass = `w-full bg-[${roxoPrimary}] dark:bg-[${roxoDark}]`; // No mobile, a largura é controlada pelo Content

  return (
    <nav
      className={`${baseNavClass} ${isMobile ? mobileClass : desktopWidthClass}
      ${isMobile ? "" : "max-sm:hidden"} `} // Esconde a SideBar desktop no mobile
    >
      {/* Cabeçalho do menu mobile (apenas mobile) */}
      {isMobile && (
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold text-gray-50">Menu</h2>
          <button onClick={onClose} className="text-gray-50">
            <TbLogout2 size={24} />{" "}
            {/* Usando TbLogout2 como ícone de fechar, ou outro ícone */}
          </button>
        </div>
      )}

      {/* Logos (oculto no mobile, exceto no cabeçalho) */}
      <div className="mt-4 max-sm:hidden w-full flex justify-center">
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

      <ul
        className={`flex flex-col h-full w-full py-3 text-gray-100 ${
          isMobile ? "text-sm" : "text-[17px]"
        }`} // Ajusta o tamanho da fonte
      >
        {/* Item: Painel */}
        <li
          title="Painel"
          className={`flex items-center cursor-pointer hover:bg-white/10 ${
            pathName === "/medicao" && "bg-white/20"
          } ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
          onClick={onClose} // Fecha o menu mobile ao clicar
        >
          <Link
            href="/medicao"
            className={`w-full h-full flex items-center gap-2 ${
              showSideBar || isMobile ? "justify-start" : "justify-center"
            }`}
          >
            <TbTable size={isMobile ? 20 : 22} />
            {(showSideBar || isMobile) && <span>Dashboard</span>}
          </Link>
        </li>

        {/* Itens para Admin */}
        {user?.is_adm && (
          <>
            {/* Item: Cadastrar loja */}
            <li
              title="Cadastrar loja"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/registerStore" && "bg-white/20"
              } ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
              onClick={onClose}
            >
              <Link
                href="/registerStore"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                <TbHomePlus size={isMobile ? 20 : 26} />
                {(showSideBar || isMobile) && <span>Registrar loja</span>}
              </Link>
            </li>

            {/* Item: Editar loja */}
            <li
              title="Editar loja"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/editStore" && "bg-white/20"
              } ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
              onClick={onClose}
            >
              <Link
                href="/editStore"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                <TbHomeEdit size={isMobile ? 20 : 26} />
                {(showSideBar || isMobile) && <span>Editar loja</span>}
              </Link>
            </li>

            {/* Item: Cadastrar usuário */}
            <li
              title="Cadastrar usuário"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/registerUser" && "bg-white/20"
              } ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
              onClick={onClose}
            >
              <Link
                href="/registerUser"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                <TbUserPlus size={isMobile ? 20 : 26} />
                {(showSideBar || isMobile) && <span>Registrar usuário</span>}
              </Link>
            </li>

            {/* Item: Editar usuário (com Sheet) */}
            <li
              title="Editar usuário"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                isSheetOpen && "bg-white/20" // Destaca se a Sheet estiver aberta
              } ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
            >
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button // Use um button para o trigger da Sheet
                    className={`w-full h-full flex items-center gap-2 ${
                      showSideBar || isMobile
                        ? "justify-start"
                        : "justify-center"
                    }`}
                  >
                    <TbUserEdit size={isMobile ? 20 : 26} />
                    {(showSideBar || isMobile) && <span>Editar usuário</span>}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side={"left"}
                  className="bg-[#3D3C6C] dark:bg-[#151526]"
                >
                  {" "}
                  {/* Ajusta cor do SheetContent */}
                  <SheetHeader>
                    <SheetTitle>Selecione o usuário</SheetTitle>
                    <SheetDescription className="w-full text-gray-100 dar flex justify-between px-4 my-2">
                      <span>Nome</span>Função
                    </SheetDescription>
                    <div className="w-full flex flex-col gap-4 pt-4">
                      {" "}
                      {/* Removido bg-red */}
                      {userAll?.map((user) => (
                        <Button
                          key={user.user_id}
                          variant={"outline"}
                          className="w-full"
                          onClick={onClose} // Fecha o menu mobile e a Sheet
                        >
                          <Link
                            href={`/editUser/${user.user_id}`}
                            className="w-full h-full flex justify-between items-center rounded-xl px-4 hover:bg-gray-200 dark:hover:bg-[#2B2B41]"
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
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </li>

            {/* Item: Exportar Excel */}
            <li
              title="Exportar Excel"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/exportExcel" && "bg-white/20"
              } ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
              onClick={onClose}
            >
              <Link
                href="/exportExcel"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                <TbFileExcel size={isMobile ? 20 : 24} />
                {(showSideBar || isMobile) && <span>Relatorio</span>}
              </Link>
            </li>
          </>
        )}

        {/* Item: Perfil (oculto no mobile, pois o menu mobile já tem o perfil do usuário) */}
        {!isMobile && (
          <li
            title="Perfil"
            className={`flex items-center cursor-pointer hover:bg-white/10 ${
              pathName === "/profile" && "bg-white/20"
            } ${showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
          >
            <Link
              href="/profile"
              className={`w-full h-full flex items-center gap-2 ${
                showSideBar ? "justify-start" : "justify-center"
              }`}
            >
              <TbUserCircle size={isMobile ? 20 : 24} />
              {showSideBar && <span>Perfil</span>}
            </Link>
          </li>
        )}

        {/* Botão de Sair (logout) */}
        <li
          title="Sair"
          className={
            `mt-auto mb-4 flex justify-center 
                      ${isMobile ? "py-2 px-4" : showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}
                      bg-red-500/30 hover:bg-red-500/50 dark:bg-red-600/30 dark:hover:bg-red-600/50 rounded-md mx-2` // Vermelho mais transparente e arredondado
          }
        >
          <button
            onClick={handleLogout}
            className="h-full flex items-center gap-2 w-full justify-center cursor-pointer text-gray-100" // Cor do texto clara
          >
            <TbLogout2 size={isMobile ? 20 : 26} />
            {(showSideBar || isMobile) && <span>Sair</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}
