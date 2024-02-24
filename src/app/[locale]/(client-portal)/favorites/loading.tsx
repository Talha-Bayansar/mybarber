import { Main } from "~/components/layout/main";
import { TitleSkeleton } from "~/components/layout/title";
import { BarbershopsListSkeleton } from "../(root)/_components/barbershops-list";

const FavoritesLoading = () => {
  return (
    <Main>
      <TitleSkeleton />
      <BarbershopsListSkeleton />
    </Main>
  );
};

export default FavoritesLoading;
