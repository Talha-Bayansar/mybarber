import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { ReservationForm } from "./_components/reservation-form";

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

  return (
    <Main>
      <Title>{t("title")}</Title>
      <ReservationForm searchParams={searchParams} />
    </Main>
  );
};

export default NewReservationPage;
