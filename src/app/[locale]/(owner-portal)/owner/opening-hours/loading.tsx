import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { Skeleton } from "~/components/ui/skeleton";
import { generateArray } from "~/lib/utils";

const OpeningHoursLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <List>
        {generateArray(7).map((v) => (
          <Skeleton key={v} className="h-12 w-full" />
        ))}
      </List>
    </Main>
  );
};

export default OpeningHoursLoading;
