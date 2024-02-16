"use client";
import { isArrayEmpty } from "~/lib/utils";
import { api } from "~/trpc/react";
import { List } from "~/components/layout/list";
import { HeartOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { BarbershopsListSkeleton } from "./barbershops-list";
import { BarbershopItem } from "./barbershop-item";

type Props = {
  initialData: string;
};

export const FavoritesList = ({ initialData }: Props) => {
  const { data: barbershops, isLoading } =
    api.barbershop.getFavoriteBarbershops.useQuery(undefined, {
      initialData: JSON.parse(initialData),
    });

  if (isLoading) return <BarbershopsListSkeleton />;

  if (!barbershops || isArrayEmpty(barbershops)) return <NoFavorites />;

  return (
    <List className="md:grid md:grid-cols-2">
      {barbershops.map((barbershop) => (
        <BarbershopItem
          key={barbershop.id}
          isFavorite
          barbershop={barbershop}
        />
      ))}
    </List>
  );
};

const NoFavorites = () => {
  const t = useTranslations("RootPage");

  return (
    <div className="mt-20 flex w-full flex-col items-center gap-4">
      <HeartOff className="text-primary" size={60} />
      <p className="text-center">{t("no_favorites")}</p>
    </div>
  );
};