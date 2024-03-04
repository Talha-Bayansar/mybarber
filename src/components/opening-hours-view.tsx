import { getTranslations } from "next-intl/server";
import type { OpeningHoursRecord } from "~/server/db/xata";
import { List } from "./layout/list";
import { cn, generateArray, getTimeFromMs, isArrayEmpty } from "~/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type Props = {
  openingHours: OpeningHoursRecord[];
};

export const OpeningHoursView = async ({ openingHours }: Props) => {
  const t = await getTranslations("global");

  return (
    <List className="gap-2">
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
                      (timeRange) => timeRange.day_of_week === item,
                    ) as OpeningHoursRecord[]
                  }
                />
              </div>
            ))}
          </List>
        </CardContent>
      </Card>
      <div className="text-primary">{t("with_reservation_footnote")}</div>
    </List>
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
            .map(({ id, start_time, duration, with_reservation }) => (
              <div
                key={id}
                className={cn({
                  "text-primary": with_reservation,
                })}
              >
                {getTimeFromMs(start_time!)} -{" "}
                {getTimeFromMs(start_time! + duration!)}
                {with_reservation && "*"}
              </div>
            ))}
    </List>
  );
};

export const OpeningHoursViewSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <List>
          {generateArray(7).map((v) => (
            <Skeleton key={v} className="h-8 w-full" />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
