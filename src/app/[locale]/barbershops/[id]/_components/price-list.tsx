import { EmptyState, List } from "~/components";
import { getCurrencyByCode, isArrayEmpty } from "~/lib";
import type {
  BarbershopRecord,
  PriceListItemRecord,
  PriceListRecord,
} from "~/server/db";
import { api } from "~/trpc/server";

type Props = {
  barbershop: BarbershopRecord;
};

type PriceList = PriceListRecord & {
  items: PriceListItemRecord[];
};

export const PriceList = async ({ barbershop }: Props) => {
  let priceList: PriceList | null;
  try {
    priceList = (await api.priceList.getByBarbershopId.query({
      barbershopId: barbershop.id,
    })) as PriceList;
  } catch (error) {
    priceList = null;
  }

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
            {getCurrencyByCode(priceList!.currency!)?.symbol}{" "}
            {item.price?.toFixed(2)}
          </span>
        </div>
      ))}
    </List>
  );
};
