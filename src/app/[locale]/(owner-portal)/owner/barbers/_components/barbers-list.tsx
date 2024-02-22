import type { BarberRecord, BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";
import { List } from "~/components/layout/list";
import { generateArray, isArrayEmpty } from "~/lib/utils";
import { EmptyState } from "~/components/empty-state";
import { Skeleton } from "~/components/ui/skeleton";
import { BarberItem } from "./barber-item";

export const BarbersList = async () => {
  let barbers: BarberRecord[];
  try {
    const response = await api.barber.getByMyBarbershop.query();
    barbers = response as BarbershopRecord[];
  } catch (error) {
    barbers = [];
  }

  if (isArrayEmpty(barbers)) return <EmptyState />;

  return (
    <List>
      {barbers.map((barber) => (
        <BarberItem key={barber.id} barber={barber} />
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
