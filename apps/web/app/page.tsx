import { Card } from "@repo/ui/Card";

import { BtnCheckoutStripe } from "./BtnCheckoutStripe";
import { BtnSendEmail } from "./BtnSendEmail";

export default async function Home() {
  return (
    <div className="p-10">
      <h1 className="text-center text-5xl font-bold text-black">
        Template WEB 🇲🇽
      </h1>

      <Card
        title="Send email with nodemailer"
        color="primary"
        sx="w-full md:w-2xl mx-auto my-10"
      >
        <p className="py-5">Click the button to send a email</p>

        <BtnSendEmail />
      </Card>

      <Card
        title="Checkout with stripe"
        color="secondary"
        sx="w-full md:w-2xl mx-auto my-10"
      >
        <p className="py-5">Click the button to send a email</p>

        <BtnCheckoutStripe />
      </Card>
    </div>
  );
}
