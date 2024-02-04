import { SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const EmptyState = async () => {
  const t = await getTranslations("global");
  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      <SearchX className="text-primary" size={60} />
      <p className="text-center">{t("no_results")}</p>
    </div>
  );
};
