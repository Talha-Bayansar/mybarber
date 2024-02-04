"use client";
import { useTranslations } from "next-intl";
import { Button } from ".";
import { signIn } from "next-auth/react";

export const SignInButton = () => {
  const t = useTranslations("global");

  return (
    <Button variant="outline" onClick={() => signIn("google")}>
      {t("sign_in")}
    </Button>
  );
};
