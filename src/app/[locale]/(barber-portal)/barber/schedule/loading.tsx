import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { ScheduleSkeleton } from "./_components/schedule";

const ScheduleLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <ScheduleSkeleton />
    </Main>
  );
};

export default ScheduleLoading;
