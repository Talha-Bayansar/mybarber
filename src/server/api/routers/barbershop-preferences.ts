import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const barbershopPreferencesRouter = createTRPCRouter({
  getByMyBarbershop: protectedProcedure.query(async ({ ctx }) => {
    const { xata, session } = ctx;

    const preferences = await xata.db.barbershop_preferences
      .filter({
        "barbershop.owner": session.user.id,
      })
      .getFirst();

    return preferences;
  }),
  updateMyBarbershopPreferences: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(10).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const preferences = await xata.db.barbershop_preferences
        .filter({
          "barbershop.owner": session.user.id,
        })
        .getFirstOrThrow();

      const response = await preferences.update({
        prepayment_amount: input.amount,
      });

      if (!response) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return response;
    }),
});
