import Link from "next/link";
import { Button, Card, EmptyState, List, Skeleton } from "~/components";
import { generateArray, isArrayEmpty, routes } from "~/lib";
import { type FavoriteBarbershopRecord } from "~/server/db";
import { api } from "~/trpc/server";
import { BarbershopItem } from ".";

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
  let hasSearched = false;

  let barbershops;

  if (!!name || !!zip) {
    hasSearched = true;

    barbershops = await api.barbershop.search.query({
      name: name,
      zip: zip,
      size: SIZE,
      offset: (page - 1) * SIZE,
    });
  } else {
    hasSearched = false;

    barbershops = await api.barbershop.getFavoriteBarbershops.query({
      size: SIZE,
      offset: (page - 1) * SIZE,
    });
  }

  const getParamsURI = (page: number) => {
    let url = `page=${page}`;

    if (hasSearched && (!!name || !!zip)) {
      if (!!name) {
        url += `&name=${name}`;
      } else {
        url += `&zip=${zip}`;
      }
    }

    return url;
  };

  if (isArrayEmpty(barbershops.records)) return <EmptyState />;

  if (!hasSearched)
    return (
      <List>
        <p className="mb-4 text-center text-gray-500">Favorties</p>
        <List className="md:grid md:grid-cols-2">
          {barbershops.records.map((barbershop: FavoriteBarbershopRecord) => (
            <BarbershopItem
              key={barbershop.id}
              isFavorite
              barbershopJSON={JSON.stringify(barbershop.barbershop)}
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

  return (
    <List>
      <p className="mb-4 text-center text-gray-500">
        Result(s) for "{params.name || params.zip}"
      </p>
      <List className="md:grid md:grid-cols-2">
        {barbershops.records.map((barbershop) => (
          <BarbershopItem
            key={barbershop.id}
            isFavorite={false}
            barbershopJSON={JSON.stringify(barbershop)}
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
