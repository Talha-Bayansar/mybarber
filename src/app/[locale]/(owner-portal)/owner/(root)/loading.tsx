import { List } from "~/components/layout/list";
import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { SettingCardSkeleton } from "~/components/setting-card";
import { generateArray } from "~/lib/utils";

const OwnerLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <List className="md:grid md:grid-cols-2">
        {generateArray(6).map((v) => (
          <SettingCardSkeleton key={v} />
        ))}
      </List>
    </Main>
  );
};

export default OwnerLoading;
