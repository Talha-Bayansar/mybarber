"use server";
import { List, Section } from "~/components";
import { BarbershopsList, FavoritesList } from ".";
import { api } from "~/trpc/server";
import { type BarbershopRecord } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { getTranslations } from "next-intl/server";

export const SearchResult = async () => {
  const session = await getServerAuthSession();
  const t = await getTranslations("RootPage");
  let favorites: BarbershopRecord[] | null = null;

  if (!!session?.user) {
    favorites = await api.barbershop.getFavoriteBarbershops.query();
  }

  return (
    <List>
      <BarbershopsList />
      {favorites && (
        <Section title={t("favorites_subtitle")}>
          <FavoritesList initialData={JSON.stringify(favorites)} />
        </Section>
      )}
    </List>
  );
};
