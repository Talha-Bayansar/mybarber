import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { SettingCard } from "~/components/setting-card";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import type { BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";
import { NotVerified } from "./_components/not-verified";

type DashboardItem = {
  title: string;
  description: string;
  href: string;
};

const OwnerPage = async () => {
  const t = await getTranslations("Owner.RootPage");
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
      title: t("barbershop_details"),
      description: t("barbershop_details_description"),
      href: routes.owner.barbershopDetails.root,
    },
    {
      title: t("preferences"),
      description: t("preferences_description"),
      href: routes.owner.preferences.root,
    },
  ];

  return (
    <Main>
      <Title>{barbershop.name}</Title>
      {!barbershop.verified && <NotVerified />}
      <List className="md:grid md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.title} href={item.href}>
            <SettingCard title={item.title} description={item.description} />
          </Link>
        ))}
      </List>
    </Main>
  );
};

export default OwnerPage;
