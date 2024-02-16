import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { List } from "~/components/layout/list";
import { SettingCard } from "~/components/setting-card";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import type { BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

type DashboardItem = {
  title: string;
  description: string;
  href: string;
};

const OwnerPage = async () => {
  const t = await getTranslations("OwnerPage");
  let barbershop: BarbershopRecord;
  try {
    barbershop = (await api.barbershop.getByOwner.query()) as BarbershopRecord;
  } catch (error) {
    notFound();
  }

  const items: DashboardItem[] = [
    {
      title: t("price_list"),
      description: t("price_list_description"),
      href: routes.owner.priceList.root,
    },
    {
      title: t("opening_hours"),
      description: t("opening_hours_description"),
      href: routes.owner.openingHours.root,
    },
    {
      title: t("reservations"),
      description: t("reservations_description"),
      href: routes.owner.reservations.root,
    },
    {
      title: t("barbers"),
      description: t("barbers_description"),
      href: routes.owner.barbers.root,
    },
    {
      title: t("preferences"),
      description: t("preferences_description"),
      href: routes.owner.preferences.root,
    },
  ];

  return (
    <List className="md:grid md:grid-cols-2">
      {items.map((item) => (
        <Link key={item.title} href={item.href}>
          <SettingCard title={item.title} description={item.description} />
        </Link>
      ))}
    </List>
  );
};

export default OwnerPage;