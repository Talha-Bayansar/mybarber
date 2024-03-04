import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { OpeningHoursViewSkeleton } from "~/components/opening-hours-view";

const OpeningHoursLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <OpeningHoursViewSkeleton />
    </Main>
  );
};

export default OpeningHoursLoading;
