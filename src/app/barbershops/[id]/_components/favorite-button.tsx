"use client";
import { Heart } from "lucide-react";
import React from "react";
import { IconButton } from "~/components";
import { cn } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  barbershopId: string;
};

export const FavoriteButton = ({ barbershopId }: Props) => {
  const { refetch } = api.barbershop.getFavoriteBarbershops.useQuery();
  const {
    data: isFavorite,
    isLoading,
    refetch: refetchIsFavorite,
  } = api.barbershop.isFavorite.useQuery({
    id: barbershopId,
  });
  const toggleFavorite = api.barbershop.toggleFavorite.useMutation({
    onSuccess: async () => {
      await refetch();
      await refetchIsFavorite();
    },
  });

  return (
    <IconButton
      className="p-2"
      disabled={isLoading}
      onClick={() =>
        toggleFavorite.mutate({
          barbershopId: barbershopId,
        })
      }
    >
      <Heart
        className={cn({
          "text-red-500": isFavorite,
        })}
      />
    </IconButton>
  );
};
