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
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

export function AppProvider({ children }: AppProviderProps) {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [user, setUser] = useState<UsuarioProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dateFull, setDateFull] = useState<string>(currentDate);
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [queryClient] = useState(() => new QueryClient());
  const [typeMedicao, setTypeMedicao] = useState<string>("");
  const [localidade, setLocalidade] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data } = useUser();
  useEffect(() => {
    function getUser() {
      if (data) {
        setUser(data.user);
        setToken(data.access_token);
        const currentName = user?.nome_completo.split(" ")[0];
        if (currentName) {
          setFirstName(currentName);
        }
      }
    }

    getUser();
  }, [data, user]);

  return (
    <AppContext.Provider
      value={{
        showSideBar,
        setShowSideBar,
        user,
        setUser,
        token,
        setToken,
        dateFull,
        month,
        setMonth,
        year,
        setYear,
        setDateFull,
        typeMedicao,
        setTypeMedicao,
        localidade,
        setLocalidade,
        firstName,
        setFirstName,
        searchQuery,
        setSearchQuery,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
