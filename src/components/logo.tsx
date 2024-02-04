"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

type Props = {
  size?: number;
};

export const Logo = ({ size = 200 }: Props) => {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === "dark")
    return (
      <Image
        className="h-full w-full"
        src={"/icons/icon-white.svg"}
        width={size}
        height={size}
        alt="MyBarber logo"
      />
    );

  return (
    <Image
      className="h-full w-full"
      src={"/icons/icon-black.svg"}
      width={size}
      height={size}
      alt="MyBarber logo"
    />
  );
};
