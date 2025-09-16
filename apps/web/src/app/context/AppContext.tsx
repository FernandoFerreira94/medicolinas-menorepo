"use client";
import type { UsuarioProps } from "@repo/utils";
import { createContext } from "react";

interface AppContextType {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  user: UsuarioProps | null;
  setUser: (user: UsuarioProps | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  dateFull: string;
  setDateFull: (date: string) => void;
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
  typeMedicao: string;
  setTypeMedicao: (typeMedicao: string) => void;
  localidade: string;
  setLocalidade: (localidade: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
