import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
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
  getByMyBarber: protectedProcedure.query(async ({ ctx }) => {
    const { xata, session } = ctx;

    const barberHairTypes = await xata.db.barber_hair_type
      .filter({
        "barber.user.id": session.user.id,
      })
      .select(["hair_type.*"])
      .getAll();

    const hairTypes = barberHairTypes.map((record) => record.hair_type);
    return hairTypes;
  }),
});
