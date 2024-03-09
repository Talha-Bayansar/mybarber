import { getTranslations } from "next-intl/server";
import { SettingCard } from "~/components/setting-card";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import { getServerAuthSession } from "~/server/auth";
import type { BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

export const OwnerSetting = async () => {
  let barbershop: BarbershopRecord;
  const session = await getServerAuthSession();
  const t = await getTranslations("SettingsPage");

  if (!session) return null;

  try {
    const response = await api.barbershop.getByOwner.query();
    barbershop = response as BarbershopRecord;
  } catch (error) {
    return (
      <SettingCard
        title={t("barbershop_registration")}
        description={t("barbershop_registration_description")}
        trailing={
          <Button asChild>
            <Link href={routes.barbershops.registration.root}>
              {t("barbershop_registration_action")}
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <SettingCard
      title={t("owner_panel")}
      description={t("owner_panel_description")}
      trailing={
        <Button asChild>
          <Link href={routes.owner.root}>{t("owner_panel_action")}</Link>
        </Button>
      }
    />
  );
};
