import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { BarbershopFormSkeleton } from "./_components/barbershop-form";

const BarbershopDetailsLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <BarbershopFormSkeleton />
    </Main>
  );
};

export default BarbershopDetailsLoading;
