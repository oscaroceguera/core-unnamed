import { z } from "zod";

export const fiscalDataSchema = z.object({
  rfc: z
    .string()
    .trim()
    .min(12)
    .max(13)
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i),
  legalName: z.string().trim().min(3),
  taxRegime: z
    .string()
    .trim()
    .regex(/^\d{3}$/),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/),
  cfdiUse: z
    .string()
    .trim()
    .regex(/^[A-Z0-9]{2,4}$/i),
});

export type FiscalData = z.infer<typeof fiscalDataSchema>;

export const createInvoicingSchema = z
  .object({
    orderId: z.string().min(1),
    buyerEmail: z.email(),
    checkoutSessionId: z.string().min(1),
    ticketType: z.string().min(1),
    quantity: z.coerce.number().int().positive(),
  })
  .and(fiscalDataSchema);

export type InvoicingState = {
  success?: boolean;
  facturapiError?: string;
  payload?: FormData;
  errors?: {
    rfc?: string[];
    legalName?: string[];
    taxRegime?: string[];
    postalCode?: string[];
    cfdiUse?: string[];
  };
};
