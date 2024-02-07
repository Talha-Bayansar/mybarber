"use client";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export const SignInButton = () => {
  const t = useTranslations("global");

  return (
    <Button variant="outline" onClick={() => signIn("google")}>
      {t("sign_in")}
    </Button>
  );
};
