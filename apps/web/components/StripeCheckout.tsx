import { Card } from "@repo/ui/Card";

import { BtnCheckoutStripe } from "./BtnCheckoutStripe";

export function StripeCheckout() {
  return (
    <Card title="Checkout with stripe" color="secondary">
      <p className="py-5">Click the button to send a email</p>
      <BtnCheckoutStripe />
    </Card>
  );
}
