import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { PageWrapper } from "~/components/layout/page-wrapper";
import { Title } from "~/components/layout/title";
import { ReservationForm } from "./_components/reservation-form";
import { RootNavBar } from "~/components/root-nav-bar";
import { getServerAuthSession } from "~/server/auth";
import { AuthRequired } from "~/components/auth-required";

type Props = {
  searchParams: {
    barber?: string;
    date?: string;
    time?: string;
    reservation?: string;
  };
};

const NewReservationPage = async ({ searchParams }: Props) => {
  const t = await getTranslations("NewReservationPage");
  const session = await getServerAuthSession();

  return (
    <PageWrapper>
      <Main>
        <Title>{t("title")}</Title>
        {session ? (
          <ReservationForm searchParams={searchParams} />
        ) : (
          <AuthRequired />
        )}
      </Main>
      <RootNavBar />
    </PageWrapper>
  );
};

export default NewReservationPage;