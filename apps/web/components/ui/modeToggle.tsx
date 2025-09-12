// src/components/ModeToggle.tsx

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  // Read both the current theme and the function to set it
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      // HERE: Check the current theme and set the opposite one
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.4rem] w-[1.4rem] scale-200 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.4rem] w-[1.4rem] scale-0 rotate-0 transition-all dark:scale-200 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
