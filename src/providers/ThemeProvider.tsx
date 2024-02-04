"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  let themePreference = "system";
  if (typeof window !== "undefined") {
    themePreference = localStorage.getItem("theme") ?? "system";
  }
  return (
    <NextThemesProvider {...props} defaultTheme={themePreference}>
      {children}
    </NextThemesProvider>
  );
}
