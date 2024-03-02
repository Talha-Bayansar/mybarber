import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { BarbershopForm } from "./_components/barbershop-form";
import { api } from "~/trpc/server";
import { EditButton } from "./_components/edit-button";

const BarbershopDetailsPage = async () => {
  const t = await getTranslations("Owner.BarbershopDetailsPage");

  const barbershop = await api.barbershop.getByOwner.query();

  return (
    <Main>
      <div className="flex items-start justify-between">
        <Title>{t("title")}</Title>
        <EditButton />
      </div>
      <BarbershopForm barbershopData={barbershop} />
    </Main>
  );
};

export default BarbershopDetailsPage;
