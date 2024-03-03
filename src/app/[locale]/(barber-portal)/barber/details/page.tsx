import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { BarberForm } from "./_components/barber-form";
import { api } from "~/trpc/server";
import type { BarberRecord } from "~/server/db/xata";
import { EditButton } from "./_components/edit-button";

const DetailsPage = async () => {
  const t = await getTranslations("Barber.DetailsPage");

  const barber = await api.barber.getMyBarber.query();

  return (
    <Main>
      <div className="flex items-start justify-between">
        <Title>{t("title")}</Title>
        <EditButton />
      </div>
      <BarberForm barberData={barber as BarberRecord} />
    </Main>
  );
};

export default DetailsPage;
