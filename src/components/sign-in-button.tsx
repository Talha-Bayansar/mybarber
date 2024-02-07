"use client";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";

export const SignInButton = () => {
  const t = useTranslations("global");

  return (
    <Button
      className="flex items-center gap-1"
      onClick={() => signIn("google")}
    >
      {t("sign_in")} <FcGoogle size={20} />
    </Button>
  );
};
