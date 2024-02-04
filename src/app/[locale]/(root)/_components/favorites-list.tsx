"use client";
import { isArrayEmpty } from "~/lib";
import { BarbershopItem, BarbershopsListSkeleton } from ".";
import { api } from "~/trpc/react";
import { List } from "~/components";
import { HeartOff } from "lucide-react";

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
  return (
    <div className="mt-20 flex w-full flex-col items-center gap-4">
      <HeartOff className="text-primary" size={60} />
      <p className="text-center">You don't have any favorite barbershops.</p>
    </div>
  );
};
