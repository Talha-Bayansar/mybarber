"use server";
import { List, Section } from "~/components";
import { BarbershopsList, FavoritesList } from ".";
import { api } from "~/trpc/server";
import { type BarbershopRecord } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";

export const SearchResult = async () => {
  const session = await getServerAuthSession();
  let favorites: BarbershopRecord[] | null = null;

  if (!!session?.user) {
    favorites = await api.barbershop.getFavoriteBarbershops.query();
  }

  return (
    <List>
      <BarbershopsList />
      {favorites && (
        <Section title="My favorites">
          <FavoritesList initialData={JSON.stringify(favorites)} />
        </Section>
      )}
    </List>
  );
};
