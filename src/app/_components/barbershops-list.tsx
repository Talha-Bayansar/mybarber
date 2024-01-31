import Image from "next/image";
import Link from "next/link";
import { Button, Card, EmptyState, List, Skeleton } from "~/components";
import { generateArray, isArrayEmpty, routes } from "~/lib";
import { type BarbershopRecord } from "~/server/db";
import { api } from "~/trpc/server";

type Props = {
  params: {
    name?: string;
    zip?: string;
    page?: string;
  };
};

export const BarbershopsList = async ({ params }: Props) => {
  const { name, zip } = params;
  const SIZE = 20;
  const page = Number(params.page ?? 1);

  const barbershops = await api.barbershop.search.query({
    name: name,
    zip: zip,
    size: SIZE,
    offset: (page - 1) * SIZE,
  });

  const getParamsURI = (page: number) => {
    let url = `page=${page}`;

    if (!!name || !!zip) {
      if (!!name) {
        url += `&name=${name}`;
      } else {
        url += `&zip=${zip}`;
      }
    }

    return url;
  };

  if (isArrayEmpty(barbershops.records)) return <EmptyState />;

  return (
    <List>
      <p className="mb-4 text-center text-gray-500">
        Result(s) for "{params.name || params.zip}"
      </p>
      <List className="md:grid md:grid-cols-2">
        {barbershops.records.map((barbershop) => (
          <BarbershopItem
            key={barbershop.id}
            barbershop={barbershop as BarbershopRecord}
          />
        ))}
      </List>
      {barbershops.meta.page.more && (
        <Button asChild>
          <Link href={`${routes.root}?${getParamsURI(page + 1)}`}>Next</Link>
        </Button>
      )}
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
        <p>
          {barbershop.address?.city} {barbershop.address?.zip}
        </p>
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
