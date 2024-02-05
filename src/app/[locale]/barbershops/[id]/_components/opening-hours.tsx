import { getTranslations } from "next-intl/server";
import { generateArray, getTimeFromMs, isArrayEmpty } from "~/lib";
import { api } from "~/trpc/server";
import { Card, CardContent, List, Section } from "~/components";
import { OpeningHoursRecord } from "~/server/db";

type Props = {
  barbershopId: string;
};

export const OpeningHours = async ({ barbershopId }: Props) => {
  const t = await getTranslations("global");
  const openingHours = await api.openingHours.getAllByBarbershopId.query({
    barbershopId,
  });

  if (!openingHours || isArrayEmpty(openingHours)) return null;

  return (
    <Section title={t("opening_hours")}>
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
    </Section>
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
