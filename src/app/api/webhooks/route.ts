import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { xata } from "~/server/db";
import Cors from "micro-cors";

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

Cors({
  allowMethods: ["POST", "HEAD"],
});

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, signature!, secret);

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.metadata?.reservation_id) {
        throw new Error(`missing reservation_id on metadata, ${event.id}`);
      }

      await xata.db.reservation.update({
        id: event.data.object.metadata.reservation_id,
        is_paid: true,
      });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 },
    );
  }
}
