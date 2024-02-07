import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const hairTypeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { xata } = ctx;

    const response = await xata.db.hair_type.getAll();

    if (!response)
      throw new TRPCError({
        code: "NOT_FOUND",
      });

    return response;
  }),
});
