"use client";
import { useTranslations } from "next-intl";
import { Button, type ButtonProps } from "./ui/button";

type Props = {
  isLoading?: boolean;
} & ButtonProps;

export const PaginationButton = ({ isLoading = false, ...props }: Props) => {
  const t = useTranslations("global");
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading ? t("loading") : t("load_more")}
    </Button>
  );
};
