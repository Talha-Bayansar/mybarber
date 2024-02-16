"use server";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";

export const CurrentUser = async () => {
  const session = await getServerAuthSession();

  if (!session) return null;

  return (
    <Card className="flex items-center gap-4 p-4">
      <Avatar>
        <AvatarImage src={session.user.image as string | undefined} />
        <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{session.user.name}</span>
    </Card>
  );
};
