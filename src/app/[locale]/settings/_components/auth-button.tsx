"use server";
import { SignInButton } from "~/components/sign-in-button";
import { SignOutButton } from "~/components/sign-out-button";
import { getServerAuthSession } from "~/server/auth";

export const AuthButton = async () => {
  const session = await getServerAuthSession();

  if (session) return <SignOutButton />;

  return <SignInButton />;
};
