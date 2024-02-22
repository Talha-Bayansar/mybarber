import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const barbershopBarberInvitationRouter = createTRPCRouter({
  getByMyBarber: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).optional().default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barber = await xata.db.barber
        .filter({
          "user.id": session.user.id,
        })
        .getFirstOrThrow();

      const invitations = await xata.db.barbershop_barber_invitation
        .filter({
          "barber.id": barber.id,
        })
        .select(["id", "barbershop.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            after: input.cursor,
          },
        });

      return invitations;
    }),
  acceptBarbershopInvitation: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const invitation = await xata.db.barbershop_barber_invitation
        .filter({
          $all: [
            {
              id: input.id,
            },
            {
              "barber.user.id": session.user.id,
            },
          ],
        })
        .select(["barber.id", "barbershop.id"])
        .getFirstOrThrow();

      const barber = await xata.db.barber.updateOrThrow({
        id: invitation.barber?.id ?? "",
        barbershop: invitation.barbershop?.id,
      });

      await invitation.delete();

      return barber;
    }),
  denyBarbershopInvitation: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;

      const invitation = await xata.db.barbershop_barber_invitation.delete({
        id: input.id,
      });

      if (!invitation)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      return invitation;
    }),

  inviteToMyBarbershop: protectedProcedure
    .input(
      z.object({
        email: z.string().min(1).email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const barbershop = await xata.db.barbershop
        .filter({
          "owner.id": session.user.id,
        })
        .getFirst();

      if (!barbershop)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      const barber = await xata.db.barber
        .filter({
          "user.email": input.email,
        })
        .getFirst();

      if (!barber)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      const alreadyInvited = await xata.db.barbershop_barber_invitation
        .filter({
          barbershop: barbershop.id,
          barber: barber.id,
        })
        .getFirst();

      if (alreadyInvited) return alreadyInvited;

      const invitation = await xata.db.barbershop_barber_invitation.create({
        barbershop: barbershop.id,
        barber: barber.id,
      });

      if (!invitation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return invitation;
    }),
});
