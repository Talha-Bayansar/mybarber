import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { EditButton } from "./_components/edit-button";
import { routes } from "~/lib/routes";
import { api } from "~/trpc/server";
import { OpeningHoursView } from "~/components/opening-hours-view";
import type { OpeningHoursRecord } from "~/server/db/xata";

const OpeningHoursPage = async () => {
  const t = await getTranslations("Owner.OpeningHoursPage");
  const openingHours = await api.openingHours.getByMyBarbershop.query();

  return (
    <Main>
      <div className="flex w-full items-start justify-between">
        <Title>{t("title")}</Title>
        <EditButton href={routes.owner.openingHours.edit.root} />
      </div>
      <OpeningHoursView openingHours={openingHours as OpeningHoursRecord[]} />
    </Main>
  );
};

export default OpeningHoursPage;
