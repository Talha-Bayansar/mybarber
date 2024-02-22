"use client";
import type { BarberRecord } from "~/server/db/xata";
import { List } from "~/components/layout/list";
import { generateArray, isArrayEmpty } from "~/lib/utils";
import { EmptyState } from "~/components/empty-state";
import { Skeleton } from "~/components/ui/skeleton";
import { BarberItem } from "./barber-item";
import { api } from "~/trpc/react";
import type { SelectedPick } from "@xata.io/client";

type Props = {
  barbers: Readonly<SelectedPick<BarberRecord, ["*"]>>[];
};

export const BarbersList = ({ barbers }: Props) => {
  const { data, isLoading } = api.barber.getByMyBarbershop.useQuery(undefined, {
    initialData: barbers,
  });

  if (isLoading) return <BarbersListSkeleton />;

  if (!data || isArrayEmpty(data)) return <EmptyState />;

  return (
    <List>
      {barbers.map((barber) => (
        <BarberItem key={barber.id} barber={barber as BarberRecord} />
      ))}
    </List>
  );
};

export const BarbersListSkeleton = () => {
  return (
    <List>
      {generateArray(10).map((v) => (
        <Skeleton key={v} className="h-16 w-full" />
      ))}
    </List>
  );
};
