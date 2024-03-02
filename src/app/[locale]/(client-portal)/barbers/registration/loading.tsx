import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { RegistrationFormSkeleton } from "./_components/registration-form";

const BarberRegistrationLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <RegistrationFormSkeleton />
    </Main>
  );
};

export default BarberRegistrationLoading;
