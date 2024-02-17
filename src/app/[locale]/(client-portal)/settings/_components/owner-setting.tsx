import { getTranslations } from "next-intl/server";
import { SettingCard } from "~/components/setting-card";
import { Button } from "~/components/ui/button";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import type { BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

export const OwnerSetting = async () => {
  let barbershop: BarbershopRecord;
  const t = await getTranslations("SettingsPage");

  try {
    const response = await api.barbershop.getByOwner.query();
    barbershop = response as BarbershopRecord;
  } catch (error) {
    return null;
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