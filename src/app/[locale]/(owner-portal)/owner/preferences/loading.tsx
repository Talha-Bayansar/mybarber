import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { SettingCardSkeleton } from "~/components/setting-card";

const PreferencesLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <SettingCardSkeleton />
    </Main>
  );
};

export default PreferencesLoading;
