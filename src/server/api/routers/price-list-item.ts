import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const priceListItemRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;

      const priceListItem = await xata.db.price_list_item
        .filter({
          id: input.id,
        })
        .getFirstOrThrow();

      return priceListItem;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        duration: z.number(),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barbershop = await xata.db.barbershop
        .filter({
          "owner.id": session.user.id,
        })
        .getFirstOrThrow();

      let priceList = await xata.db.price_list
        .filter({
          "barbershop.id": barbershop.id,
        })
        .getFirst();

      if (!priceList) {
        priceList = await xata.db.price_list.create({
          currency: "EUR",
          barbershop: barbershop.id,
        });
      }

      if (!priceList) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const response = await xata.db.price_list_item.create({
        name: input.name,
        description: input.description,
        duration: input.duration,
        price: input.price,
        price_list: priceList.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        duration: z.number(),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.price_list_item.update({
        name: input.name,
        description: input.description,
        duration: input.duration,
        price: input.price,
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;

      const response = await xata.db.price_list_item.delete({
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      return response;
    }),
});
