import { EmptyState, List } from "~/components";
import { getCurrencyByCode, isArrayEmpty } from "~/lib";
import { BarbershopRecord } from "~/server/db";
import { api } from "~/trpc/server";

type Props = {
  barbershop: BarbershopRecord;
};

export const PriceList = async ({ barbershop }: Props) => {
  const priceList = await api.priceList.getByBarbershopId.query({
    barbershopId: barbershop.id,
  });

  if (!priceList || isArrayEmpty(priceList.items)) return <EmptyState />;

  return (
    <List className="mt-4">
      {priceList.items.map((item) => (
        <div key={item.id} className="flex justify-between">
          <div className="flex flex-grow flex-col">
            <span className="text-xl font-medium">{item.name}</span>
            <span className="text-sm text-gray-500">{item.description}</span>
          </div>
          <span>
            {getCurrencyByCode(priceList.currency!)?.symbol}{" "}
            {item.price?.toFixed(2)}
          </span>
        </div>
      ))}
    </List>
  );
};
