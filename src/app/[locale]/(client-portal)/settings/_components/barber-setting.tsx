import { getTranslations } from "next-intl/server";
import { SettingCard } from "~/components/setting-card";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import { getServerAuthSession } from "~/server/auth";
import type { BarberRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

export const BarberSetting = async () => {
  let barber: BarberRecord;
  const session = await getServerAuthSession();
  const t = await getTranslations("SettingsPage");

  if (!session) return null;

  try {
    const response = await api.barber.getMyBarber.query();
    barber = response as BarberRecord;
  } catch (error) {
    return (
      <SettingCard
        title={t("barber_registration")}
        description={t("barber_registration_description")}
        trailing={
          <Button asChild>
            <Link href={routes.barbers.registration.root}>
              {t("barber_registration_action")}
            </Link>
          </Button>
        }
      />
    );
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
