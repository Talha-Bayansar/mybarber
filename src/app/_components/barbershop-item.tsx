"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { Card, IconButton } from "~/components";
import { cn } from "~/lib";
import type { BarbershopRecord } from "~/server/db";
import { api } from "~/trpc/react";

export const BarbershopItem = ({
  barbershopJSON,
  isFavorite,
}: {
  barbershopJSON: string;
  isFavorite: boolean;
}) => {
  const barbershop = JSON.parse(barbershopJSON) as BarbershopRecord;
  const toggleFavorite = api.barbershop.toggleFavorite.useMutation();

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
      <IconButton
        className="absolute right-0 top-0 p-2"
        onClick={() =>
          toggleFavorite.mutate({
            barbershopId: barbershop.id,
          })
        }
      >
        <Heart
          className={cn({
            "text-red-500": isFavorite,
          })}
        />
      </IconButton>
    </Card>
  );
};
