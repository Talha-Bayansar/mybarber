import { getTranslations } from "next-intl/server";
import { Main } from "~/components/layout/main";
import { Title } from "~/components/layout/title";
import { FavoritesList } from "./_components/favorites-list";
import { api } from "~/trpc/server";
import { BarbershopRecord } from "~/server/db/xata";
import { Placeholder } from "~/components/placeholder";
import { Heart } from "lucide-react";
import { SignInButton } from "~/components/sign-in-button";

const FavoritesPage = async () => {
  const t = await getTranslations("FavoritesPage");

  let favorites: BarbershopRecord[] | null;
  try {
    favorites = await api.barbershop.getFavoriteBarbershops.query();
  } catch (error) {
    favorites = null;
  }

  return (
    <Main>
      <Title>{t("title")}</Title>
      {
        favorites ?
        <FavoritesList barbershopsData={favorites} /> : <Placeholder
        Icon={Heart}
        text={t("auth_required")}
        action={<SignInButton />}
      />
      }
    </Main>
  );
};

export default FavoritesPage;
