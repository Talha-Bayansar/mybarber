import { getTranslations } from "next-intl/server";
import { isArrayEmpty } from "~/lib/utils";
import { api } from "~/trpc/server";
import type { OpeningHoursRecord } from "~/server/db/xata";
import { Section } from "~/components/layout/section";
import { OpeningHoursView } from "~/components/opening-hours-view";

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
      <OpeningHoursView openingHours={openingHours as OpeningHoursRecord[]} />
    </Section>
  );
};
