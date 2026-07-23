import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { stripe } from "../../../../../packages/stripe/src";

export const dynamic = "force-dynamic";

const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headerList = await headers();
  const sig = headerList.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.log("error", error);
    return new Response(null, { status: 500 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Session completed");
      break;
    }
    default: {
      console.log("Webhook Error");
    }
  }

  return new Response(null, { status: 200 });
}
