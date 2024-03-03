"use client";

import { useTranslations } from "next-intl";
import { ModalSheet } from "~/components/modal-sheet";
import { SettingCard } from "~/components/setting-card";
import { Input } from "~/components/ui/input";
import type { BarbershopPreferencesRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";
import { PrepaymentForm } from "./prepayment-form";

type Props = {
  preferences?: BarbershopPreferencesRecord | null;
};

export const PrepaymentSetting = ({ preferences }: Props) => {
  const t = useTranslations("Owner.PreferencesPage");
  const { data } = api.barbershopPreferences.getByMyBarbershop.useQuery(
    undefined,
    {
      initialData: preferences as any,
    },
  );

  return (
    <ModalSheet
      trigger={
        <button className="text-left">
          <SettingCard
            title={t("prepayment")}
            description={t("prepayment_description")}
            trailing={
              <Input
                className="md:w-min"
                type="number"
                value={data?.prepayment_amount ?? 10}
                disabled
              />
            }
          />
        </button>
      }
      content={<PrepaymentForm />}
    />
  );
};
