"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const formSchema = z.object({
  email: z.string().email().min(1),
});

export const InviteBarberForm = () => {
  const tGlobal = useTranslations("global");
  const tBarbersPage = useTranslations("Owner.BarbersPage");
  const inviteBarber =
    api.barbershopBarberInvitation.inviteToMyBarbershop.useMutation({
      onSuccess: () => {
        toast(tBarbersPage("invitation_success_message"));
      },
      onError: () => {
        toast(tBarbersPage("invitation_error_message"));
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    inviteBarber.mutate({
      email: values.email,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tGlobal("email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={inviteBarber.isLoading}
        >
          {tBarbersPage("invite")}
        </Button>
      </form>
    </Form>
  );
};
