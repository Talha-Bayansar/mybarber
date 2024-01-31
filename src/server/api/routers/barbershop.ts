import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const barbershopRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).optional().nullable(),
        zip: z.string().min(1).optional().nullable(),
        size: z.number().min(1).max(20).optional(),
        offset: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.barbershop
        .filter({
          $all: [
            {
              verified: true,
            },
            {
              $any: [
                {
                  name: {
                    $iContains: input.name,
                  },
                },
                {
                  "address.zip": input.zip,
                },
              ],
            },
          ],
        })
        .select(["*", "address.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            offset: input.offset,
          },
        });
      return response;
    }),
});
