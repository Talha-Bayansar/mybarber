import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const priceListRouter = createTRPCRouter({
  getByBarbershopId: publicProcedure
    .input(
      z.object({
        barbershopId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.price_list
        .filter({
          "barbershop.id": input.barbershopId,
        })
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const priceListItems = await xata.db.price_list_item
        .filter({
          "price_list.id": response.id,
        })
        .getAll();

      return { ...response, items: priceListItems };
    }),
});
