import { prisma } from "@repo/database";

import { AssetsAccess } from "@/components/AssetsAccess";
import { DatabaseCard } from "@/components/DatabaseCard";
import { Invoicing } from "@/components/Invoicing";
import { MockDataCard } from "@/components/MockDataCard";
import { SendEmail } from "@/components/SendEmail";
import { StripeCheckout } from "@/components/StripeCheckout";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div className="p-10">
      <h1 className="text-center text-5xl font-bold text-black">
        Template WEB 🇲🇽
      </h1>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SendEmail />
        <StripeCheckout />
        <DatabaseCard users={users} />
        <AssetsAccess />
        <Invoicing />
        <MockDataCard />
      </div>
    </div>
  );
}
