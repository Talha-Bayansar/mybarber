import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import type { BarberRecord, BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";
import { List } from "~/components/layout/list";
import { generateArray, isArrayEmpty } from "~/lib/utils";
import { EmptyState } from "~/components/empty-state";
import { Skeleton } from "~/components/ui/skeleton";

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
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                className="object-cover"
                src={barber.image?.url}
                alt={`picture of ${barber.first_name} ${barber.last_name}`}
              />
              <AvatarFallback>
                {barber.first_name?.at(0)} {barber.last_name?.at(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow text-xl">
              {barber.first_name} {barber.last_name}
            </div>
          </CardContent>
        </Card>
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
