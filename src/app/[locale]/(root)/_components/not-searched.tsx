"use client";

import { Scissors } from "lucide-react";
import { useTranslations } from "next-intl";

export const NotSearched = () => {
  const t = useTranslations("RootPage");
  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      <Scissors className="text-primary" size={60} />
      <p className="text-center">{t("not_searched")}</p>
    </div>
  );
};
