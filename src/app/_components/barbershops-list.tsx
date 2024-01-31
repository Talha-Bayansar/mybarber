import Image from "next/image";
import { Card, List, Skeleton } from "~/components";
import { generateArray, isArrayEmpty } from "~/lib";
import { type BarbershopRecord } from "~/server/db";
import { api } from "~/trpc/server";

type Props = {
  query?: string;
};

export const BarbershopsList = async ({ query }: Props) => {
  const barbershops = await api.barbershop.search.query({
    query: query ?? "",
  });

  if (isArrayEmpty(barbershops)) return <div>Empty</div>;

  return (
    <List className="md:grid md:grid-cols-2">
      {barbershops.map((barbershop) => (
        <BarbershopItem
          key={barbershop.id}
          barbershop={barbershop as BarbershopRecord}
        />
      ))}
    </List>
  );
};

const BarbershopItem = ({ barbershop }: { barbershop: BarbershopRecord }) => {
  return (
    <Card className="flex overflow-hidden">
      <Image
        className="h-24 w-24"
        width={400}
        height={400}
        alt={`Logo of ${barbershop.name}`}
        src={barbershop.logo?.url ?? "https://placehold.co/400"}
      />
      <div className="flex flex-col p-2">
        <h2>{barbershop.name}</h2>
        <p>{barbershop.address?.city}</p>
      </div>
    </Card>
  );
};

export const BarbershopsListSkeleton = () => {
  return (
    <List className="md:grid md:grid-cols-2">
      {generateArray(6).map((v) => (
        <Card key={v}>
          <Skeleton className="h-24 w-full" />
        </Card>
      ))}
    </List>
  );
};
