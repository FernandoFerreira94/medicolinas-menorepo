// apps/web/src/componente/content/index.tsx

"use client";
import { MdOutlineToggleOff, MdToggleOn } from "react-icons/md";
import { useAppContext } from "../../context/useAppContext";
import { SideBar } from "../../_componente/sideBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/modeToggle";
import { roxoPrimary, useFetchUser } from "@repo/utils";
import { Title } from "../title";

export function Content({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { showSideBar, setShowSideBar } = useAppContext();
  const { data } = useFetchUser();

  const user = data?.user;
  const firstName = user?.nome_completo.split(" ")[0];

  return (
    <main className="h-full text-gray-900 dark:text-gray-50">
      <SideBar />
      <div
        className={`h-full transition-all mr-4 duration-800 ${
          showSideBar ? "ml-62" : "ml-20"
        }`}
      >
        <div className="flex w-full mt-4 items-center">
          <button
            className="h-full cursor-pointer"
            onClick={() => setShowSideBar(!showSideBar)}
          >
            {showSideBar ? (
              <MdToggleOn
                size={35}
                className={` text-[${roxoPrimary}] dark:text-gray-50 `}
              />
            ) : (
              <MdOutlineToggleOff
                size={35}
                className={` text-[${roxoPrimary}] dark:text-gray-50 `}
              />
            )}
          </button>
          <div className="flex h-full justify-between items-center w-6/12 ">
            <h1 className="ml-4 text-2xl font-semibold flex items-center">
              {!user ? (
                <div className="space-y-2 flex items-center">
                  <Skeleton className="h-8 w-[300px]" />
                </div>
              ) : (
                ` ${firstName} - ${user.funcao}`
              )}
            </h1>
            <h1
              className={`ml-4 text-4xl font-bold text-[${roxoPrimary}] dark:text-gray-50 `}
            >
              Shopping Colinas
            </h1>
          </div>
          <div className="float-right ml-auto mr-8">
            <ModeToggle />
          </div>
        </div>
        <div className={`mt-4 h-full pl-13 border-t border-gray-300 mb-20`}>
          <section className="w-full flex mt-4 ">
            <Title text={title} />
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}
