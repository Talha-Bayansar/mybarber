import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { BarbersList, BarbersListSkeleton } from "./_components/barbers-list";
import { Suspense } from "react";
import { AddButton } from "./_components/add-button";

const BarbersPage = async () => {
  const t = await getTranslations("Owner.BarbersPage");

  return (
    <Main>
      <div className="flex items-start justify-between">
        <Title>{t("title")}</Title>
        <AddButton />
      </div>
      <Suspense fallback={<BarbersListSkeleton />}>
        <BarbersList />
      </Suspense>
    </Main>
  );
};

export default BarbersPage;
