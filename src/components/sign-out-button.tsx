"use client";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from ".";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  const t = useTranslations();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{t("global.sign_out")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("global.are_you_sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("SettingsPage.sign_out_confirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("global.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => signOut()}>
            {t("global.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
