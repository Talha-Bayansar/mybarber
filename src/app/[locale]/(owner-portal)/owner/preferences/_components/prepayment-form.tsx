"use client";

import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  prepayment_amount: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(10),
  ),
});

export const PrepaymentForm = () => {
  const t = useTranslations("global");
  const tPreferencesPage = useTranslations("Owner.PreferencesPage");
  const { data, refetch } =
    api.barbershopPreferences.getByMyBarbershop.useQuery();
  const updatePrepaymentAmount =
    api.barbershopPreferences.updateMyBarbershopPreferences.useMutation({
      onSuccess: () => {
        toast(tPreferencesPage("prepayment_success_message"));
        refetch();
      },
      onError: () => {
        toast(tPreferencesPage("prepayment_error_message"));
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prepayment_amount: data?.prepayment_amount ?? 10,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePrepaymentAmount.mutate({
      amount: values.prepayment_amount,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prepayment_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPreferencesPage("prepayment")}</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={updatePrepaymentAmount.isLoading}
        >
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};
