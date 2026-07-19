"use server";

import { redirect } from "next/navigation";
import { stripe } from "@repo/stripe";

export async function checkoutStripe(
  _prevState: { ok: boolean },
  formData: FormData
) {
  console.log("Entra el action");
  let sessionUrl = "";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        checkoutHostUrl: "http://localhost:3000",
      },
      mode: "payment",
      success_url: "http://localhost:3000/success-stripe",
      cancel_url: "http://localhost:3000/error-stripe",
    });
    sessionUrl = session.url ?? "";
  } catch (error) {
    console.log("checkoutStripe ~ error:", error);
    return {
      ok: false,
    };
  }

  if (sessionUrl) {
    redirect(sessionUrl);
  }

  return {
    ok: true,
  };
}
