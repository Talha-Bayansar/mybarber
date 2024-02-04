"use server";
import { Section } from "~/components";
import { BarbershopsList, FavoritesList, NotSearched } from ".";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { getTranslations } from "next-intl/server";

type Props = {
  searchParams: {
    zip?: string;
    name?: string;
  };
};

export const SearchResult = async ({ searchParams: { zip, name } }: Props) => {
  const session = await getServerAuthSession();
  const t = await getTranslations("RootPage");
  const hasSearched = !!(zip || name);

  if (!!session?.user && !hasSearched) {
    const favorites = await api.barbershop.getFavoriteBarbershops.query();
    return (
      <Section title={t("favorites_subtitle")}>
        <FavoritesList initialData={JSON.stringify(favorites)} />
      </Section>
    );
  }

  if (!hasSearched) return <NotSearched />;

  return <BarbershopsList />;
};
