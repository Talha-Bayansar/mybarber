"use server";
import { getTranslations } from "next-intl/server";
import { List } from "~/components/layout/list";
import { Card, CardContent } from "~/components/ui/card";
import { generateArray, getTimeFromMs, isArrayEmpty } from "~/lib/utils";
import type { OpeningHoursRecord } from "~/server/db/xata";
import { api } from "~/trpc/server";

export const OpeningHoursView = async () => {
  const t = await getTranslations("global");
  const openingHours =
    await api.openingHours.getByMyBarbershop.query(undefined);

  return (
    <Card>
      <CardContent className="p-4">
        <List>
          {generateArray(7).map((item) => (
            <div key={`opening_hour_${item}`} className="flex">
              <span className="flex-grow font-medium">
                {t(`day_of_week.${item}`)}
              </span>
              <OpeningHoursItem
                openingHours={
                  openingHours.filter(
                    (openingHoursInstance) =>
                      openingHoursInstance.day_of_week === item,
                  ) as OpeningHoursRecord[]
                }
              />
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const OpeningHoursItem = async ({
  openingHours,
}: {
  openingHours: OpeningHoursRecord[];
}) => {
  const t = await getTranslations("global");
  return (
    <List className="gap-0">
      {isArrayEmpty(openingHours)
        ? t("closed")
        : openingHours
            .sort((a, b) => a.start_time! - b.start_time!)
            .map(({ id, start_time, duration }) => (
              <div key={id}>
                {getTimeFromMs(start_time!)} -{" "}
                {getTimeFromMs(start_time! + duration!)}
              </div>
            ))}
    </List>
  );
};
