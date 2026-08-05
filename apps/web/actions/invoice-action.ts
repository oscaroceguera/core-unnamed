"use server";

import { facturapi } from "@repo/facturapi";

import {
  createInvoicingSchema,
  type InvoicingState,
} from "@/types/invoice-schema";

export async function createInvoice(
  _prevState: InvoicingState,
  formData: FormData
): Promise<InvoicingState> {
  const raw = {
    orderId: formData.get("orderId"),
    buyerEmail: formData.get("buyerEmail"),
    rfc: (formData.get("rfc") as string)?.toUpperCase().trim(),
    legalName: formData.get("legalName"),
    taxRegime: formData.get("taxRegime"),
    postalCode: formData.get("postalCode"),
    cfdiUse: formData.get("cfdiUse"),
    checkoutSessionId: formData.get("checkoutSessionId"),
    ticketType: formData.get("ticketType"),
    quantity: formData.get("quantity"),
  };
  console.log("🚀 ~ createInvoice ~ raw:", raw);

  const parsed = createInvoicingSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.issues.reduce<Record<string, string[]>>(
      (acc, issue) => {
        const key = issue.path[0] as string;
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue.message);
        return acc;
      },
      {}
    );
    return {
      payload: formData,
      errors: {
        rfc: fieldErrors.rfc,
        legalName: fieldErrors.legalName,
        taxRegime: fieldErrors.taxRegime,
        postalCode: fieldErrors.postalCode,
        cfdiUse: fieldErrors.cfdiUse,
      },
    };
  }

  const {
    buyerEmail,
    rfc,
    legalName,
    taxRegime,
    postalCode,
    cfdiUse,
    quantity,
  } = parsed.data;

  try {
    const createdInvoice = await facturapi.invoices.create({
      customer: {
        legal_name: legalName,
        tax_id: rfc.toUpperCase(),
        tax_system: taxRegime,
        email: buyerEmail,
        address: {
          zip: postalCode,
          country: "MEX",
        },
      },
      use: cfdiUse.toUpperCase(),
      payment_form: "04",
      payment_method: "PUE",
      items: [
        {
          quantity: Math.max(quantity, 1),
          product: {
            description: "JSConf Mexico 2026 - Early Bird Ticket",
            product_key: "90101500",
            unit_key: "E48",
            unit_name: "Servicio",
            price: 1500,
          },
        },
      ],
    });
    console.log("🚀 ~ createInvoice ~ createdInvoice:", createdInvoice);

    try {
      await facturapi.invoices.sendByEmail(createdInvoice.id, {
        email: buyerEmail,
      });
    } catch (emailError) {
      console.error("[Facturapi Email Error]", emailError);
    }
  } catch (error) {
    console.log("🚀 ~ createInvoice ~ error:", error);

    return {
      success: false,
      facturapiError:
        error instanceof Error ? error.message : "Failed to create invoice",
    };
  }

  return { success: true };
}
