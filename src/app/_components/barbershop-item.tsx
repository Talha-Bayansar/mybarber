"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { Card, IconButton } from "~/components";
import { cn } from "~/lib";
import type { BarbershopRecord } from "~/server/db";
import { api } from "~/trpc/react";

type BarbershopItemProps = {
  barbershopJSON: string;
  isFavorite?: boolean;
};

export const BarbershopItem = ({
  barbershopJSON,
  isFavorite,
}: BarbershopItemProps) => {
  const barbershop = JSON.parse(barbershopJSON) as BarbershopRecord;

  return (
    <Card className="relative flex overflow-hidden pr-10">
      <Image
        className="h-24 w-24"
        width={400}
        height={400}
        alt={`Logo of ${barbershop.name}`}
        src={barbershop.logo?.url ?? "https://placehold.co/400"}
      />
      <div className="flex flex-col p-2">
        <h2>{barbershop.name}</h2>
        <p>
          {barbershop.address?.city} {barbershop.address?.zip}
        </p>
      </div>
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
  const toggleFavorite = api.barbershop.toggleFavorite.useMutation();

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
