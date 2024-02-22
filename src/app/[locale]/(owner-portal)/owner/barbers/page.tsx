import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { BarbersList } from "./_components/barbers-list";
import { AddButton } from "./_components/add-button";
import type { BarberRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";
import type { SelectedPick } from "@xata.io/client";

const BarbersPage = async () => {
  const t = await getTranslations("Owner.BarbersPage");

  let barbers: Readonly<SelectedPick<BarberRecord, ["*"]>>[];
  try {
    const response = await api.barber.getByMyBarbershop.query();
    barbers = response;
  } catch (error) {
    barbers = [];
  }

  return (
    <Main>
      <div className="flex items-start justify-between">
        <Title>{t("title")}</Title>
        <AddButton />
      </div>
      <BarbersList barbers={barbers} />
    </Main>
  );
};

export default BarbersPage;
