import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { BarbersList, BarbersListSkeleton } from "./_components/barbers-list";
import { Suspense } from "react";

const BarbersPage = async () => {
  const t = await getTranslations("Owner.BarbersPage");

  return (
    <Main>
      <Title>{t("title")}</Title>
      <Suspense fallback={<BarbersListSkeleton />}>
        <BarbersList />
      </Suspense>
    </Main>
  );
};

export default BarbersPage;
