import Image from "next/image";
import IconMainMx from "@repo/assets/images/icons/mainMx.svg";
import IconAxolotl from "@repo/assets/images/illustrations/axolotl.svg";
import IconPrimary from "@repo/assets/images/logos/primary.svg";
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
        title="Database consult"
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
      <Card
        title="Assets consult"
        sx="w-full md:w-2xl mx-auto my-10"
        color="primary"
      >
        <div className="grid grid-cols-3 items-center justify-items-center">
          <Image src={IconMainMx} alt="Made in mexico" />
          <Image src={IconAxolotl} alt="Axolotl" loading="eager" />
          <Image src={IconPrimary} alt="Brand icon" />
        </div>
      </Card>
    </div>
  );
}
