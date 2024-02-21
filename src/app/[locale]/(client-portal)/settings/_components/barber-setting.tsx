import { getTranslations } from "next-intl/server";
import { SettingCard } from "~/components/setting-card";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import type { BarberRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

export const BarberSetting = async () => {
  let barber: BarberRecord;
  const t = await getTranslations("SettingsPage");

  try {
    const response = await api.barber.getMyBarber.query();
    barber = response as BarberRecord;
  } catch (error) {
    return null;
  }

  return (
    <SettingCard
      title={t("barber_panel")}
      description={t("barber_panel_description")}
      trailing={
        <Button asChild>
          <Link href={routes.barber.root}>{t("barber_panel_action")}</Link>
        </Button>
      }
    />
  );
};
