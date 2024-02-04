import { WifiOff } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("global");
  return (
    <div className="grid h-screen place-content-center place-items-center gap-8 p-8">
      <WifiOff className="text-destructive" size={80} />
      <p className="text-center">{t("offline")}</p>
    </div>
  );
};

export default Page;
