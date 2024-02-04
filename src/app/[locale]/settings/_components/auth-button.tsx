"use server";
import { SignInButton, SignOutButton } from "~/components";
import { getServerAuthSession } from "~/server/auth";

export const AuthButton = async () => {
  const session = await getServerAuthSession();

  if (session) return <SignOutButton />;

  return <SignInButton />;
};
