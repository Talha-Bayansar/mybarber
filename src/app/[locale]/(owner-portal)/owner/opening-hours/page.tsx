import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { EditButton } from "./_components/edit-button";
import { routes } from "~/lib/routes";
import { OpeningHoursView } from "./_components/opening-hours-view";

const OpeningHoursPage = async () => {
  const t = await getTranslations("OwnerOpeningHoursPage");

  return (
    <Main>
      <div className="flex w-full items-start justify-between">
        <Title>{t("title")}</Title>
        <EditButton href={routes.owner.openingHours.edit.root} />
      </div>
      <OpeningHoursView />
    </Main>
  );
};

export default OpeningHoursPage;
