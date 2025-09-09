"use client";
import { MdOutlineToggleOff } from "react-icons/md";
import { MdToggleOn } from "react-icons/md";
import { useAppContext } from "../../context/useAppContext";
import { SideBar } from "../../componente/sideBar";

export function Content({ children }: { children: React.ReactNode }) {
  const { showSideBar, setShowSideBar } = useAppContext();
  return (
    <main className=" h-full  ">
      <SideBar />

      <div
        className={` h-full transition-all   duration-800  ${
          showSideBar ? "ml-45" : "ml-20"
        }`}
      >
        <div className="flex w-full  items-end">
          <button
            className="mt-4  cursor-pointer "
            onClick={() => setShowSideBar(!showSideBar)}
          >
            {showSideBar ? (
              <MdToggleOn size={35} color="#3D3C6C" />
            ) : (
              <MdOutlineToggleOff size={35} color="#3D3C6C" />
            )}
          </button>
          <h1 className="ml-4 text-3xl font-semibold">Colinas - Admin</h1>
        </div>

        <div className=" mt-4 h-full pl-13">{children}</div>
      </div>
    </main>
  );
}
