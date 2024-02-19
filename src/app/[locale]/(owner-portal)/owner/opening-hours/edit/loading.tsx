import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { OpeningHoursFormSkeleton } from "../_components/opening-hours-form";

const EditOpeningHoursLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <OpeningHoursFormSkeleton />
    </Main>
  );
};

export default EditOpeningHoursLoading;
