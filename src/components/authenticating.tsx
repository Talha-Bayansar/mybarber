"use client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Main } from "./layout/main";
import { Logo } from "./logo";

export const Authenticating = () => {
  const t = useTranslations("global");
  return (
    <Main className="flex-grow items-center justify-center gap-8">
      <div className="h-60">
        <Logo />
      </div>
      <div className="flex flex-col items-center">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p>{t("authenticating")}</p>
      </div>
    </Main>
  );
};
