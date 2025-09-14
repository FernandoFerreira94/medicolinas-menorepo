// apps/web/src/context/AppProvider.tsx

"use client";
import { ReactNode, useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsuarioProps, useUser, fetchLojas } from "@repo/utils";

interface AppProviderProps {
  children: ReactNode;
}

const date = new Date();
const currentMonth = date.getMonth() + 1;

export function AppProvider({ children }: AppProviderProps) {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [user, setUser] = useState<UsuarioProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(2025);
  const [queryClient] = useState(() => new QueryClient());
  const [typeMedicao, setTypeMedicao] = useState<string>("");

  useEffect(() => {
    async function getLojas() {
      const lojas = await fetchLojas("Gas");
      console.log(lojas);
    }
    getLojas();
  });

  const { data } = useUser();
  useEffect(() => {
    function getUser() {
      if (data) {
        setUser(data.user);
        setToken(data.access_token);
      }
    }

    getUser();
  }, [data, user]);

  useEffect(() => {
    if (user) {
      switch (user.funcao) {
        case "Bombeiro":
          setTypeMedicao("Gas");
          break;
        case "M5-Eletricista":
          setTypeMedicao("Energia");
          break;
        case "M4-Serviços Gerais":
          setTypeMedicao("Agua");
          break;
        default:
          setTypeMedicao("Energia");
          break;
      }
    } else {
      setTypeMedicao("Energia");
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        showSideBar,
        setShowSideBar,
        user,
        setUser,
        token,
        setToken,
        month,
        setMonth,
        year,
        setYear,
        typeMedicao,
        setTypeMedicao,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
