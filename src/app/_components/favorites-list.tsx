"use client";
import { EmptyState, List } from "~/components";
import { isArrayEmpty } from "~/lib";
import { BarbershopItem, BarbershopsListSkeleton } from ".";
import { api } from "~/trpc/react";

type Props = {
  initialData: string;
};

export const FavoritesList = ({ initialData }: Props) => {
  const { data: barbershops, isLoading } =
    api.barbershop.getFavoriteBarbershops.useQuery(undefined, {
      initialData: JSON.parse(initialData),
    });

  if (isLoading) return <BarbershopsListSkeleton />;

  if (!barbershops || isArrayEmpty(barbershops)) return <EmptyState />;

  return (
    <List>
      <p className="mb-4 text-center text-gray-500">Favorties</p>
      <List className="md:grid md:grid-cols-2">
        {barbershops.map((barbershop) => (
          <BarbershopItem
            key={barbershop.id}
            isFavorite
            barbershop={barbershop}
          />
        ))}
      </List>
    </List>
  );
};
