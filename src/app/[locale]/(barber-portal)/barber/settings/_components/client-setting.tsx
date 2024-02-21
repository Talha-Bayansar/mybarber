import { getTranslations } from "next-intl/server";
import { SettingCard } from "~/components/setting-card";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";

export const ClientSetting = async () => {
  const t = await getTranslations("Owner.SettingsPage");
  return (
    <SettingCard
      title={t("client_panel")}
      description={t("client_panel_description")}
      trailing={
        <Button asChild>
          <Link href={routes.root}>{t("client_panel_action")}</Link>
        </Button>
      }
    />
  );
};
