import { UserButton } from "@clerk/nextjs";
import { api } from "~/trpc/server";

export default async function Home() {
  const response = await api.barbershop.search.query({
    query: "test",
  });
  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
