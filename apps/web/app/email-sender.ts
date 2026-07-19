"use server";

import { sendEmail } from "@repo/mailer";

export async function emailSender(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  try {
    await sendEmail({
      to: "oscar@jsconf.mx",
      subject:
        "🎁 JSConf MX 2026 - ¡Recibiste un Boleto de Regalo! | You Received a Gift Ticket!",
      text: "Hello oscar?",
      html: "<h1>Hola Oscar Eduardo</h1>",
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
