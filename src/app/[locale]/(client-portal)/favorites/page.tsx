import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { FavoritesList } from "./_components/favorites-list";
import { api } from "~/trpc/server";
import { BarbershopRecord } from "~/server/db/xata";

const FavoritesPage = async () => {
  const t = await getTranslations("FavoritesPage");

  let favorites: BarbershopRecord[];
  try {
    favorites = await api.barbershop.getFavoriteBarbershops.query();
  } catch (error) {
    favorites = [];
  }

  return (
    <Main>
      <Title>{t("title")}</Title>
      <FavoritesList barbershopsData={favorites} />
    </Main>
  );
};

export default FavoritesPage;
