"use client";
import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

export const EmptyState = () => {
  const t = useTranslations("global");
  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      <SearchX className="text-primary" size={60} />
      <p className="text-center">{t("no_results")}</p>
    </div>
  );
};
