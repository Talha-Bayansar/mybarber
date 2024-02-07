"use client";

import { isArrayEmpty, getCurrencyByCode } from "~/lib/utils";
import { type NewReservationForm } from "./reservation-form";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { InputFieldSkeleton } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";

type Props = {
  form: NewReservationForm;
};

export const TreatmentField = ({ form }: Props) => {
  const t = useTranslations();
  const { id: barbershopId } = useParams<{ id: string }>();
  const { data: priceList, isLoading: isLoadingPriceList } =
    api.priceList.getByBarbershopId.useQuery({
      barbershopId,
    });

  if (isLoadingPriceList) return <InputFieldSkeleton />;

  return (
    <FormField
      control={form.control}
      name="priceListItemId"
      render={() => (
        <FormItem>
          <FormLabel>{t("global.treatment")}</FormLabel>
          <FormControl>
            <Select onValueChange={(v) => form.setValue("priceListItemId", v)}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t("NewReservationPage.select_treatment")}
                />
              </SelectTrigger>
              <SelectContent>
                {priceList && !isArrayEmpty(priceList.items) ? (
                  priceList.items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (
                      {getCurrencyByCode(priceList.currency ?? "")?.symbol}{" "}
                      {item.price?.toFixed(2)})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="not-available">
                    {t("global.not_available")}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
