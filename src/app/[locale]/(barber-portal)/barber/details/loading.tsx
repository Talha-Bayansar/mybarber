import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { BarberFormSkeleton } from "./_components/barber-form";

const DetailsLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <BarberFormSkeleton />
    </Main>
  );
};

export default DetailsLoading;
