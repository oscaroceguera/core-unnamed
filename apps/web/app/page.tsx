import { prisma } from "@repo/database";
import { Card } from "@repo/ui/Card";

import { BtnCheckoutStripe } from "./BtnCheckoutStripe";
import { BtnSendEmail } from "./BtnSendEmail";

export default async function Home() {
  const users = await prisma.user.findMany();

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

      <Card
        title="Databse consult"
        color="tertiary"
        sx="w-full md:w-2xl mx-auto my-10"
      >
        {users.map((user) => (
          <ul key={user.id}>
            <li>ID: {user.id}</li>
            <li>Fullname: {user.fullname}</li>
            <li>Email: {user.email}</li>
          </ul>
        ))}
      </Card>
    </div>
  );
}
