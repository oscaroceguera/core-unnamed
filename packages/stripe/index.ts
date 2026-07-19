import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables"
      );
    }

    stripeInstance = new Stripe(apiKey, {
      apiVersion: "2026-06-24.dahlia",
    });
  }

  return stripeInstance;
}

// Legacy export for backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => {
    return getStripe()[prop as keyof Stripe];
  },
});
