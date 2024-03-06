"use client";
import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

export const EmptyState = () => {
  const t = useTranslations("global");
  return (
    <div className="mt-20 flex flex-grow flex-col items-center justify-center gap-4 md:justify-start">
      <SearchX className="text-primary" size={60} />
      <p className="text-center">{t("no_results")}</p>
    </div>
  );
};
