import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import nodemailer, { type Transporter } from "nodemailer";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

const DEFAULT_FROM = '"JSConf MX" <no-reply@jsconf.mx>';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const region = process.env.INFRA_REGION;
  const accessKeyId = process.env.INFRA_ACCESS_KEY_ID;
  const secretAccessKey = process.env.INFRA_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing mailer env vars: INFRA_REGION, INFRA_ACCESS_KEY_ID, INFRA_SECRET_ACCESS_KEY",
    );
  }

  const sesClient = new SESv2Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  transporter = nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand },
  });

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM,
}: SendEmailInput): Promise<void> {
  await getTransporter().sendMail({ from, to, subject, html, text });
}
