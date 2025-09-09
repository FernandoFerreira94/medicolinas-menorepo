// apps/web/src/context/AppProvider.tsx

"use client";
import type { UsuarioProps } from "@repo/utils";
import { ReactNode, useState } from "react";
import { AppContext } from "./AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [user, setUser] = useState<UsuarioProps | null>(null);

  // Crie a instância do QueryClient apenas uma vez
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppContext.Provider value={{ showSideBar, setShowSideBar, user, setUser }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
