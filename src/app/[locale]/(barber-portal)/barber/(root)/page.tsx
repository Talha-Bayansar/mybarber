import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { SettingCard } from "~/components/setting-card";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import type { BarberRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

type DashboardItem = {
  title: string;
  description: string;
  href: string;
};

const BarberPage = async () => {
  const t = await getTranslations("Barber.RootPage");
  let barber: BarberRecord;
  try {
    barber = (await api.barber.getMyBarber.query()) as BarberRecord;
  } catch (error) {
    notFound();
  }

  const items: DashboardItem[] = [
    {
      title: t("schedule"),
      description: t("schedule_description"),
      href: routes.barber.schedule.root,
    },
    {
      title: t("invitations"),
      description: t("invitations_description"),
      href: routes.barber.invitations.root,
    },
  ];

  return (
    <Main>
      <Title>
        {t("welcome_message", {
          name: `${barber.first_name} ${barber.last_name}`,
        })}
      </Title>
      <List className="md:grid md:grid-cols-2 md:items-stretch">
        {items.map((item) => (
          <Link key={item.title} href={item.href}>
            <SettingCard title={item.title} description={item.description} />
          </Link>
        ))}
      </List>
    </Main>
  );
};

export default BarberPage;
