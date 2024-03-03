"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { api } from "~/trpc/react";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const formSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  image: z.instanceof(File),
});

const uploadImage = async (uploadUrl: string, file: File) => {
  await fetch(uploadUrl, { method: "PUT", body: file });
};

export const RegistrationForm = () => {
  const t = useTranslations("global");
  const tRegistration = useTranslations("BarberRegistrationPage");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      image: new File([], ""),
    },
  });

  const registerBarber = api.barber.register.useMutation({
    onSuccess: async (response) => {
      setUploading(true);
      await uploadImage(response.image!.uploadUrl!, form.getValues("image"));
      setUploading(false);
      toast(tRegistration("registration_success_message"));
      router.push(routes.barber.root);
    },
    onError: () => {
      toast(tRegistration("registration_error_message"));
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    registerBarber.mutate({
      ...values,
      imageName: values.image.name,
      imageFileType: values.image.type,
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("first_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("first_name_placeholder")}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("last_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("last_name_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("image")}</FormLabel>
                <FormControl>
                  <Input
                    accept=".jpg, .jpeg, .png, .svg"
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
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
          disabled={registerBarber.isLoading || uploading}
        >
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};

export const RegistrationFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <List className="gap-8">
        {generateArray(3).map((v) => (
          <InputFieldSkeleton key={v} />
        ))}
      </List>
      <InputSkeleton />
    </List>
  );
};
