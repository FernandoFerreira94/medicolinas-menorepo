"use client";
import type { UsuarioProps } from "@repo/utils";
import { createContext } from "react";

interface AppContextType {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  user: UsuarioProps | null;
  setUser: (user: UsuarioProps | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
