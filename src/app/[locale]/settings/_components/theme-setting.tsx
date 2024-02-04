"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SettingCard,
} from "~/components";

export const ThemeSetting = () => {
  const { themes, setTheme, theme } = useTheme();
  const t = useTranslations("SettingsPage");

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem("theme", value);
  };

  return (
    <SettingCard
      title={t("display_mode")}
      description={t("display_mode_description")}
      trailing={
        <Select value={theme ?? "light"} onValueChange={handleThemeChange}>
          <SelectTrigger className="capitalize md:w-min">
            <SelectValue placeholder={t("select_theme")} />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => (
              <SelectItem className="capitalize" key={theme} value={theme}>
                {t(theme)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
};
