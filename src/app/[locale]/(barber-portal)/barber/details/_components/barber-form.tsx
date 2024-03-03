"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Input,
  InputFieldSkeleton,
  InputSkeleton,
} from "~/components/ui/input";
import { routes } from "~/lib/routes";
import { generateArray } from "~/lib/utils";
import { useRouter } from "~/navigation";
import type { BarberRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const formSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

type Props = {
  barberData: BarberRecord;
};

export const BarberForm = ({ barberData }: Props) => {
  const t = useTranslations("global");
  const params = useSearchParams();
  const editable = params.get("editable") ? true : false;
  const router = useRouter();
  const tBarber = useTranslations("Barber.DetailsPage");
  const { data: barber, refetch } = api.barber.getMyBarber.useQuery(undefined, {
    initialData: barberData as any,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: barber.first_name ?? "",
      lastName: barber.last_name ?? "",
    },
  });

  const updateBarber = api.barber.updateMyBarber.useMutation({
    onSuccess: async () => {
      await refetch();
      toast(tBarber("update_success_message"));
      router.replace(routes.barber.barberDetails.root);
    },
    onError: () => {
      toast(tBarber("update_error_message"));
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    updateBarber.mutate({
      ...values,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <div className="flex flex-col gap-8">
          <FormField
            control={form.control}
            name="firstName"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarber("first_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarber("first_name_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarber("first_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarber("first_name_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={updateBarber.isLoading || !editable}
        >
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};

export const BarberFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <List className="gap-8">
        {generateArray(2).map((v) => (
          <InputFieldSkeleton key={v} />
        ))}
      </List>
      <InputSkeleton />
    </List>
  );
};
