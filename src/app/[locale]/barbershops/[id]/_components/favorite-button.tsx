"use client";
import { Heart } from "lucide-react";
import { IconButton } from "~/components/icon-button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  barbershopId: string;
};

export const FavoriteButton = ({ barbershopId }: Props) => {
  const utils = api.useUtils();
  const { refetch } = api.barbershop.getFavoriteBarbershops.useQuery();
  const {
    data: isFavorite,
    isLoading,
    refetch: refetchIsFavorite,
  } = api.barbershop.isFavorite.useQuery({
    id: barbershopId,
  });
  const toggleFavorite = api.barbershop.toggleFavorite.useMutation({
    onMutate({ barbershopId }) {
      utils.barbershop.isFavorite.setData(
        {
          id: barbershopId,
        },
        (previousData) => {
          return !previousData;
        },
      );
    },
    onSuccess: async () => {
      await refetch();
      await refetchIsFavorite();
    },
  });

  return (
    <IconButton
      className="p-2"
      disabled={isLoading}
      onClick={() => {
        toggleFavorite.mutate({
          barbershopId: barbershopId,
        });
      }}
    >
      <Heart
        className={cn({
          "text-red-500": isFavorite,
        })}
      />
    </IconButton>
  );
};
