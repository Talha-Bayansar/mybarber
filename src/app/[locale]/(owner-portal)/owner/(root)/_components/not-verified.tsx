import { AlertCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export const NotVerified = async () => {
  const t = await getTranslations("global");

  return (
    <Alert className="mb-4" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t("warning")}</AlertTitle>
      <AlertDescription>{t("not_verified")}</AlertDescription>
    </Alert>
  );
};
