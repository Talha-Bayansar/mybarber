import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const barbershopRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.barbershop
        .filter({
          name: {
            $iContains: input.query,
          },
        })
        .select(["*", "address.*"])
        .getAll();
      return response;
    }),
});
