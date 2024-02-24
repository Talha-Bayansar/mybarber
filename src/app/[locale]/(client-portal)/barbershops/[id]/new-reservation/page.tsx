import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationForm } from "./_components/reservation-form";
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
    <Main>
      <Title>{t("title")}</Title>
      {session ? (
        <ReservationForm searchParams={searchParams} />
      ) : (
        <AuthRequired />
      )}
    </Main>
  );
};

export default NewReservationPage;
