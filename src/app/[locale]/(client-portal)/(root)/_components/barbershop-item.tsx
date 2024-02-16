"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { IconButton } from "~/components/icon-button";
import { Card } from "~/components/ui/card";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { Link } from "~/navigation";
import type { BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";

type BarbershopItemProps = {
  barbershop: BarbershopRecord;
  isFavorite?: boolean;
};

export const BarbershopItem = ({
  barbershop,
  isFavorite,
}: BarbershopItemProps) => {
  return (
    <Card
      className={cn("relative flex overflow-hidden", {
        "pr-10": isFavorite,
      })}
    >
      <Link
        href={`${routes.barbershops.root}/${barbershop.id}`}
        className="flex flex-grow"
      >
        <Image
          className="h-24 w-24"
          width={400}
          height={400}
          alt={`Logo of ${barbershop.name}`}
          src={barbershop.logo?.url ?? "https://placehold.co/400/png"}
        />
        <div className="flex flex-col p-2">
          <h2>{barbershop.name}</h2>
          <p>
            {barbershop.address?.city} {barbershop.address?.zip}
          </p>
        </div>
      </Link>
      {isFavorite && (
        <FavoriteButton isFavorite={isFavorite} barbershopId={barbershop.id} />
      )}
    </Card>
  );
};

type FavoriteButtonProps = {
  isFavorite: boolean;
  barbershopId: string;
};

const FavoriteButton = ({ isFavorite, barbershopId }: FavoriteButtonProps) => {
  const utils = api.useUtils();
  const { refetch } = api.barbershop.getFavoriteBarbershops.useQuery();
  const toggleFavorite = api.barbershop.toggleFavorite.useMutation({
    onMutate: ({ barbershopId }) => {
      utils.barbershop.getFavoriteBarbershops.setData(
        undefined,
        (previousData) => {
          return previousData?.filter((data) => data.id !== barbershopId) ?? [];
        },
      );
    },
    onSuccess: async () => {
      await refetch();
    },
  });

  return (
    <IconButton
      className="absolute right-0 top-0 p-2"
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
