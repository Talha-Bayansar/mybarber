import { List } from "~/components/layout/list";
import { SettingCardSkeleton } from "~/components/setting-card";
import { generateArray } from "~/lib/utils";

const OwnerLoading = async () => {
  return (
    <List className="md:grid md:grid-cols-2">
      {generateArray(5).map((v) => (
        <SettingCardSkeleton key={v} />
      ))}
    </List>
  );
};

export default OwnerLoading;
