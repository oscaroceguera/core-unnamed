"use server";

import { sendEmail } from "@repo/mailer";

export async function emailSender(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  try {
    await sendEmail({
      to: "oscar@jsconf.mx",
      subject: "Example Subject",
      text: "Hello Dude!",
      html: "<h1>Hello Dude!</h1>",
    });
    return { ok: true };
  } catch (error) {
    console.error("emailSender failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
